import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarUsuario } from '@/lib/adminAuth'

export async function GET(request, { params }) {

    const { autorizado, usuarioId, esAdmin } = await verificarUsuario(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    // OJO: no se pide es_correcta ni justificacion; nunca deben salir de este endpoint
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
            preguntas (
                id,
                enunciado,
                tipo,
                orden,
                opciones ( id, texto, orden )
            )
        `)
        .eq('id', evaluacionId)
        .maybeSingle()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Los usuarios solo ven evaluaciones publicadas; los administradores también los borradores
    if (!evaluacion || (!evaluacion.activo && !esAdmin)) {
        return NextResponse.json({ error: 'Evaluación no disponible' }, { status: 404 })
    }

    const info = {
        id: evaluacion.id,
        titulo: evaluacion.titulo,
        descripcion: evaluacion.descripcion,
        codigo: evaluacion.codigo,
        activo: evaluacion.activo,
        total_preguntas: evaluacion.preguntas.length
    }

    // Si ya la presentó, solo se devuelve su resultado (nunca las preguntas)
    if (!esAdmin) {

        const {
            data: intento,
            error: intentoError
        } = await supabaseAdmin
            .from('intentos')
            .select('aprobado, puntaje, puntaje_maximo, created_at')
            .eq('evaluacion_id', evaluacionId)
            .eq('usuario_id', usuarioId)
            .eq('anulado', false)
            .maybeSingle()

        if (intentoError) {
            return NextResponse.json({ error: intentoError.message }, { status: 400 })
        }

        if (intento) {
            return NextResponse.json({
                evaluacion: info,
                esAdmin,
                preguntas: null,
                resultado: {
                    aprobado: intento.aprobado,
                    puntaje: intento.puntaje,
                    puntaje_maximo: intento.puntaje_maximo,
                    fecha: intento.created_at,
                    vistaPrevia: false
                }
            })
        }

    }

    const preguntas = [...evaluacion.preguntas]
        .sort((a, b) => a.orden - b.orden)
        .map((p) => ({
            id: p.id,
            enunciado: p.enunciado,
            tipo: p.tipo,
            opciones: [...p.opciones]
                .sort((a, b) => a.orden - b.orden)
                .map((o) => ({ id: o.id, texto: o.texto }))
        }))

    return NextResponse.json({
        evaluacion: info,
        esAdmin,
        preguntas,
        resultado: null
    })

}