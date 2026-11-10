import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'
import {
    texto,
    validarPreguntas,
    validarCategorias,
    validarMinimo,
    contarIntentos,
    contarPreguntas,
    recalcularAprobados,
    guardarCategorias,
    reemplazarPreguntas
} from '@/lib/evaluacionesServer'

export async function GET(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    const {
        data: evaluacion,
        error
    } = await supabaseAdmin
        .from('evaluaciones')
        .select(`
            id,
            titulo,
            descripcion,
            codigo,
            activo,
            min_correctas,
            created_at,
            updated_at,
            evaluacion_categorias ( categoria_id ),
            preguntas (
                id,
                enunciado,
                tipo,
                orden,
                justificacion,
                opciones ( id, texto, es_correcta, orden )
            )
        `)
        .eq('id', evaluacionId)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { total, error: intentosError } = await contarIntentos(evaluacionId)

    if (intentosError) {
        return NextResponse.json({ error: intentosError }, { status: 400 })
    }

    return NextResponse.json({
        evaluacion: { ...evaluacion, total_historial: total }
    })

}

export async function PATCH(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    const body = await request.json()

    // 1) Validar todo antes de tocar la base de datos
    if (body.titulo !== undefined && !texto(body.titulo)) {
        return NextResponse.json({ error: 'Debes ingresar el título.' }, { status: 400 })
    }

    const errorCategorias = validarCategorias(body.categorias)

    if (errorCategorias) {
        return NextResponse.json({ error: errorCategorias }, { status: 400 })
    }

    let totalPreguntas = null

    if (body.preguntas !== undefined) {

        const errorPreguntas = validarPreguntas(body.preguntas)

        if (errorPreguntas) {
            return NextResponse.json({ error: errorPreguntas }, { status: 400 })
        }

        const { total, error: intentosError } = await contarIntentos(evaluacionId)

        if (intentosError) {
            return NextResponse.json({ error: intentosError }, { status: 400 })
        }

        if (total > 0) {
            return NextResponse.json(
                { error: 'No se pueden modificar las preguntas porque la evaluación ya tiene resultados.' },
                { status: 409 }
            )
        }

        totalPreguntas = body.preguntas.length

    }

    // Mínimo para aprobar: se valida contra el total de preguntas que quedará
    const cambiaMinimo = body.min_correctas !== undefined
    let minimoFinal = null

    if (cambiaMinimo || body.preguntas !== undefined) {

        if (totalPreguntas === null) {

            const { total, error: preguntasError } = await contarPreguntas(evaluacionId)

            if (preguntasError) {
                return NextResponse.json({ error: preguntasError }, { status: 400 })
            }

            totalPreguntas = total

        }

        if (cambiaMinimo) {

            minimoFinal = Number(body.min_correctas)

        } else {

            // Solo cambian las preguntas: el mínimo vigente debe seguir siendo válido
            const {
                data: actual,
                error: actualError
            } = await supabaseAdmin
                .from('evaluaciones')
                .select('min_correctas')
                .eq('id', evaluacionId)
                .maybeSingle()

            if (actualError) {
                return NextResponse.json({ error: actualError.message }, { status: 400 })
            }

            if (!actual) {
                return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
            }

            minimoFinal = actual.min_correctas

        }

        const errorMinimo = validarMinimo(minimoFinal, totalPreguntas)

        if (errorMinimo) {
            return NextResponse.json({ error: errorMinimo }, { status: 400 })
        }

    }

    // 2) Campos de la evaluación
    const camposActualizables = {}

    if (body.titulo !== undefined) camposActualizables.titulo = texto(body.titulo)
    if (body.descripcion !== undefined) camposActualizables.descripcion = texto(body.descripcion) || null
    if (body.codigo !== undefined) camposActualizables.codigo = texto(body.codigo) || null
    if (body.activo !== undefined) camposActualizables.activo = body.activo === true
    if (cambiaMinimo) camposActualizables.min_correctas = minimoFinal

    // updated_at solo cambia al editar contenido, no al publicar o despublicar
    const cambiaContenido = ['titulo', 'descripcion', 'codigo', 'categorias', 'preguntas', 'min_correctas']
        .some((campo) => body[campo] !== undefined)

    if (cambiaContenido) {
        camposActualizables.updated_at = new Date().toISOString()
    }

    if (Object.keys(camposActualizables).length > 0) {

        const {
            error: evaluacionError
        } = await supabaseAdmin
            .from('evaluaciones')
            .update(camposActualizables)
            .eq('id', evaluacionId)

        if (evaluacionError) {
            return NextResponse.json({ error: evaluacionError.message }, { status: 400 })
        }

    }

    // 3) Categorías
    if (body.categorias !== undefined) {

        const { error: categoriasError } = await guardarCategorias(
            evaluacionId,
            body.categorias
        )

        if (categoriasError) {
            return NextResponse.json({ error: categoriasError }, { status: 400 })
        }

    }

    // 4) Preguntas
    if (body.preguntas !== undefined) {

        const { error: preguntasError } = await reemplazarPreguntas(
            evaluacionId,
            body.preguntas
        )

        if (preguntasError) {
            return NextResponse.json({ error: preguntasError }, { status: 400 })
        }

    }

    // 5) Si cambió el mínimo, se recalcula el estado de los resultados ya guardados
    if (cambiaMinimo) {

        const { error: recalculoError } = await recalcularAprobados(evaluacionId, minimoFinal)

        if (recalculoError) {
            return NextResponse.json({ error: recalculoError }, { status: 400 })
        }

    }

    return NextResponse.json({ success: true })

}

export async function DELETE(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    // Las FK con ON DELETE CASCADE borran categorías, preguntas, opciones e intentos
    const {
        error
    } = await supabaseAdmin
        .from('evaluaciones')
        .delete()
        .eq('id', evaluacionId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}