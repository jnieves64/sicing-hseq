import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function GET(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params

    const {
        data: campana,
        error
    } = await supabaseAdmin
        .from('campanas')
        .select(`
            id,
            descripcion,
            tipo,
            activo,
            campana_medios ( id, url, orden )
        `)
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ campana })

}

export async function PATCH(request, { params }) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const camposActualizables = {}
    if (body.descripcion !== undefined) camposActualizables.descripcion = body.descripcion
    if (body.tipo !== undefined) camposActualizables.tipo = body.tipo
    if (body.activo !== undefined) camposActualizables.activo = body.activo

    const {
        error: campanaError
    } = await supabaseAdmin
        .from('campanas')
        .update(camposActualizables)
        .eq('id', id)

    if (campanaError) {
        return NextResponse.json({ error: campanaError.message }, { status: 400 })
    }

    if (body.urls) {

        const {
            error: borrarError
        } = await supabaseAdmin
            .from('campana_medios')
            .delete()
            .eq('campana_id', id)

        if (borrarError) {
            return NextResponse.json({ error: borrarError.message }, { status: 400 })
        }

        const medios = body.urls.map((url, index) => ({
            campana_id: Number(id),
            url,
            orden: index + 1
        }))

        const {
            error: mediosError
        } = await supabaseAdmin
            .from('campana_medios')
            .insert(medios)

        if (mediosError) {
            return NextResponse.json({ error: mediosError.message }, { status: 400 })
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

    const {
        error: mediosError
    } = await supabaseAdmin
        .from('campana_medios')
        .delete()
        .eq('campana_id', id)

    if (mediosError) {
        return NextResponse.json({ error: mediosError.message }, { status: 400 })
    }

    const {
        error: campanaError
    } = await supabaseAdmin
        .from('campanas')
        .delete()
        .eq('id', id)

    if (campanaError) {
        return NextResponse.json({ error: campanaError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}