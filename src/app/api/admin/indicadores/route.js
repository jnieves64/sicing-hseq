import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function GET(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // El listado no necesita columnas ni filas (son pesadas); solo lo que muestra la tabla.
    const {
        data: indicadores,
        error
    } = await supabaseAdmin
        .from('indicadores')
        .select('id, titulo, descripcion, graficas, activo, created_at, updated_at')
        .order('updated_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ indicadores })

}

export async function POST(request) {

    const { autorizado, usuarioId } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()

    if (!body.titulo || !String(body.titulo).trim()) {
        return NextResponse.json({ error: 'El título es obligatorio.' }, { status: 400 })
    }

    if (!Array.isArray(body.columnas) || !Array.isArray(body.filas) || !Array.isArray(body.graficas)) {
        return NextResponse.json({ error: 'Formato de datos inválido.' }, { status: 400 })
    }

    const {
        data: indicador,
        error
    } = await supabaseAdmin
        .from('indicadores')
        .insert({
            titulo: String(body.titulo).trim(),
            descripcion: body.descripcion ?? '',
            columnas: body.columnas,
            filas: body.filas,
            graficas: body.graficas,
            activo: body.activo ?? true,
            publicado_por: usuarioId
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ indicador })

}