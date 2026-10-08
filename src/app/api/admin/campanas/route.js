import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function GET(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const {
        data: campanas,
        error
    } = await supabaseAdmin
        .from('campanas')
        .select(`
            id,
            descripcion,
            tipo,
            activo,
            created_at,
            campana_medios ( id, url, orden )
        `)
        .order('orden', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ campanas })

}

export async function POST(request) {

    const { autorizado, usuarioId } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { descripcion, tipo, activo, urls } = await request.json()

    const {
        data: campana,
        error: campanaError
    } = await supabaseAdmin
        .from('campanas')
        .insert({ descripcion, tipo, activo, publicado_por: usuarioId })
        .select()
        .single()

    if (campanaError) {
        return NextResponse.json({ error: campanaError.message }, { status: 400 })
    }

    const medios = urls.map((url, index) => ({
        campana_id: campana.id,
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

    return NextResponse.json({ campana })

}