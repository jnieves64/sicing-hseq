import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

const CAMPOS_CONTENIDO = ['titulo', 'descripcion', 'columnas', 'filas', 'graficas']

export async function GET(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params

    const {
        data: indicador,
        error
    } = await supabaseAdmin
        .from('indicadores')
        .select('id, titulo, descripcion, columnas, filas, graficas, activo')
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ indicador })

}

export async function PATCH(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // Solo se actualizan los campos que realmente vienen en el body:
    // el formulario manda todo, el botón Publicar/Despublicar manda solo "activo".
    const campos = {}

    for (const campo of CAMPOS_CONTENIDO) {
        if (body[campo] !== undefined) campos[campo] = body[campo]
    }

    if (body.activo !== undefined) campos.activo = body.activo

    if (Object.keys(campos).length === 0) {
        return NextResponse.json({ error: 'No hay nada que actualizar.' }, { status: 400 })
    }

    if (campos.titulo !== undefined && !String(campos.titulo).trim()) {
        return NextResponse.json({ error: 'El título es obligatorio.' }, { status: 400 })
    }

    for (const campo of ['columnas', 'filas', 'graficas']) {
        if (campos[campo] !== undefined && !Array.isArray(campos[campo])) {
            return NextResponse.json({ error: 'Formato de datos inválido.' }, { status: 400 })
        }
    }

    // "Actualizado el..." solo cambia cuando se edita el contenido,
    // no al publicar o despublicar.
    if (CAMPOS_CONTENIDO.some((campo) => body[campo] !== undefined)) {
        campos.updated_at = new Date().toISOString()
    }

    const {
        error
    } = await supabaseAdmin
        .from('indicadores')
        .update(campos)
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}

export async function DELETE(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params

    const {
        error
    } = await supabaseAdmin
        .from('indicadores')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}