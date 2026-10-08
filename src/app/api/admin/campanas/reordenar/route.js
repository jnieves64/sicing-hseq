import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function POST(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { campanaId, direccion } = await request.json()

    const {
        data: todas,
        error: fetchError
    } = await supabaseAdmin
        .from('campanas')
        .select('id, orden')
        .order('orden', { ascending: true })

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    const posicionActual = todas.findIndex((c) => c.id === campanaId)

    if (posicionActual === -1) {
        return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 })
    }

    const posicionVecina = direccion === 'arriba' ? posicionActual - 1 : posicionActual + 1

    if (posicionVecina < 0 || posicionVecina >= todas.length) {
        return NextResponse.json({ error: 'No se puede mover más en esa dirección' }, { status: 400 })
    }

    const actual = todas[posicionActual]
    const vecina = todas[posicionVecina]

    // Intercambiamos los valores de orden entre las dos filas únicamente
    const { error: error1 } = await supabaseAdmin
        .from('campanas')
        .update({ orden: vecina.orden })
        .eq('id', actual.id)

    if (error1) {
        return NextResponse.json({ error: error1.message }, { status: 400 })
    }

    const { error: error2 } = await supabaseAdmin
        .from('campanas')
        .update({ orden: actual.orden })
        .eq('id', vecina.id)

    if (error2) {
        return NextResponse.json({ error: error2.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}