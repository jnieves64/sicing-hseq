import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarUsuario } from '@/lib/adminAuth'

const RESPUESTAS_INVALIDAS = 'Las respuestas no son válidas.'

export async function POST(request, { params }) {

    const { autorizado, usuarioId, esAdmin } = await verificarUsuario(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const respuestas = body?.respuestas

    if (!Array.isArray(respuestas)) {
        return NextResponse.json({ error: RESPUESTAS_INVALIDAS }, { status: 400 })
    }

    const {
        data: evaluacion,
        error
    } = await supabaseAdmin
        .from('evaluaciones')
        .select(`
            id,
            activo,
            min_correctas,
            preguntas (
                id,
                enunciado,
                orden,
                opciones ( id, texto, es_correcta )
            )
        `)
        .eq('id', evaluacionId)
        .maybeSingle()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!evaluacion || (!evaluacion.activo && !esAdmin)) {
        return NextResponse.json({ error: 'Evaluación no disponible' }, { status: 404 })
    }

    // Un solo intento vigente por usuario (los administradores no guardan resultados)
    if (!esAdmin) {

        const {
            data: existente,
            error: existenteError
        } = await supabaseAdmin
            .from('intentos')
            .select('id')
            .eq('evaluacion_id', evaluacionId)
            .eq('usuario_id', usuarioId)
            .eq('anulado', false)
            .maybeSingle()

        if (existenteError) {
            return NextResponse.json({ error: existenteError.message }, { status: 400 })
        }

        if (existente) {
            return NextResponse.json(
                { error: 'Ya presentaste esta evaluación.' },
                { status: 409 }
            )
        }

    }

    const preguntas = [...evaluacion.preguntas].sort((a, b) => a.orden - b.orden)

    if (preguntas.length === 0) {
        return NextResponse.json({ error: 'La evaluación no tiene preguntas.' }, { status: 400 })
    }

    // Formato esperado: [{ preguntaId, opcionIds: [uuid, ...] }, ...]
    const porPregunta = new Map()

    for (const r of respuestas) {

        const preguntaId = Number(r?.preguntaId)

        if (!Number.isInteger(preguntaId) || porPregunta.has(preguntaId) || !Array.isArray(r?.opcionIds)) {
            return NextResponse.json({ error: RESPUESTAS_INVALIDAS }, { status: 400 })
        }

        porPregunta.set(preguntaId, r.opcionIds)

    }

    if (porPregunta.size !== preguntas.length) {
        return NextResponse.json({ error: 'Debes responder todas las preguntas.' }, { status: 400 })
    }

    // Calificación: cada pregunta vale 1 punto, todo o nada
    let aciertos = 0
    const detalle = []

    for (const pregunta of preguntas) {

        const elegidasIds = porPregunta.get(pregunta.id)

        if (!elegidasIds) {
            return NextResponse.json({ error: RESPUESTAS_INVALIDAS }, { status: 400 })
        }

        if (elegidasIds.length === 0) {
            return NextResponse.json({ error: 'Debes responder todas las preguntas.' }, { status: 400 })
        }

        const elegidas = new Set(elegidasIds.map(String))

        if (elegidas.size !== elegidasIds.length) {
            return NextResponse.json({ error: RESPUESTAS_INVALIDAS }, { status: 400 })
        }

        const opcionesPorId = new Map(pregunta.opciones.map((o) => [String(o.id), o]))

        if ([...elegidas].some((opcionId) => !opcionesPorId.has(opcionId))) {
            return NextResponse.json({ error: RESPUESTAS_INVALIDAS }, { status: 400 })
        }

        const correctas = pregunta.opciones.filter((o) => o.es_correcta)

        const acierto =
            correctas.length === elegidas.size &&
            correctas.every((o) => elegidas.has(String(o.id)))

        if (acierto) aciertos += 1

        detalle.push({
            pregunta_id: pregunta.id,
            enunciado: pregunta.enunciado,
            elegidas: [...elegidas].map((opcionId) => opcionesPorId.get(opcionId).texto),
            correctas: correctas.map((o) => o.texto),
            acierto
        })

    }

    const puntajeMaximo = preguntas.length

    // Aprueba quien alcanza el mínimo de respuestas correctas definido en la evaluación
    const aprobado = aciertos >= evaluacion.min_correctas

    const resultado = {
        aprobado,
        puntaje: aciertos,
        puntaje_maximo: puntajeMaximo,
        vistaPrevia: esAdmin
    }

    // Vista previa de administrador: se califica pero no se guarda
    if (esAdmin) {
        return NextResponse.json({ resultado })
    }

    const {
        error: insertError
    } = await supabaseAdmin
        .from('intentos')
        .insert({
            evaluacion_id: evaluacionId,
            usuario_id: usuarioId,
            puntaje: aciertos,
            puntaje_maximo: puntajeMaximo,
            aprobado,
            respuestas: detalle
        })

    if (insertError) {

        // 23505 = índice único: otro envío simultáneo ya guardó el intento
        if (insertError.code === '23505') {
            return NextResponse.json(
                { error: 'Ya presentaste esta evaluación.' },
                { status: 409 }
            )
        }

        return NextResponse.json({ error: insertError.message }, { status: 400 })

    }

    return NextResponse.json({ resultado })

}