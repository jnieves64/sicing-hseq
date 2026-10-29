import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function POST(request, { params }) {

    const { autorizado, usuarioId: adminId } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const evaluacionId = Number(id)

    if (!Number.isInteger(evaluacionId)) {
        return NextResponse.json({ error: 'Identificador no válido' }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const usuarioId = Number(body?.usuarioId)

    if (!Number.isInteger(usuarioId)) {
        return NextResponse.json({ error: 'Usuario no válido' }, { status: 400 })
    }

    // No se borra nada: el intento vigente pasa a anulado y queda como historial
    const {
        data,
        error
    } = await supabaseAdmin
        .from('intentos')
        .update({
            anulado: true,
            anulado_en: new Date().toISOString(),
            anulado_por: adminId
        })
        .eq('evaluacion_id', evaluacionId)
        .eq('usuario_id', usuarioId)
        .eq('anulado', false)
        .select('id')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
        return NextResponse.json(
            { error: 'El usuario no tiene un resultado vigente en esta evaluación.' },
            { status: 404 }
        )
    }

    return NextResponse.json({ success: true })

}