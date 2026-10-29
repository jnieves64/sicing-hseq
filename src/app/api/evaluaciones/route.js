import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarUsuario } from '@/lib/adminAuth'

export async function GET(request) {

    const { autorizado, usuarioId, esAdmin } = await verificarUsuario(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const {
        data,
        error
    } = await supabaseAdmin
        .from('evaluaciones')
        .select(`
            id,
            titulo,
            descripcion,
            codigo,
            evaluacion_categorias ( categorias ( id, nombre ) ),
            preguntas ( id )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Estado del usuario en cada evaluación (los administradores no guardan resultados)
    const estados = new Map()

    if (!esAdmin) {

        const {
            data: intentos,
            error: intentosError
        } = await supabaseAdmin
            .from('intentos')
            .select('evaluacion_id, aprobado')
            .eq('usuario_id', usuarioId)
            .eq('anulado', false)

        if (intentosError) {
            return NextResponse.json({ error: intentosError.message }, { status: 400 })
        }

        intentos.forEach((i) => {
            estados.set(i.evaluacion_id, i.aprobado ? 'aprobada' : 'refuerzo')
        })

    }

    const evaluaciones = data.map((e) => ({
        id: e.id,
        titulo: e.titulo,
        descripcion: e.descripcion,
        codigo: e.codigo,
        categorias: e.evaluacion_categorias.map((ec) => ec.categorias).filter(Boolean),
        total_preguntas: e.preguntas.length,
        estado: esAdmin ? null : (estados.get(e.id) || 'pendiente')
    }))

    return NextResponse.json({ evaluaciones, esAdmin })

}