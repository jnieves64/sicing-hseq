import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function GET(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const {
        data: usuarios,
        error
    } = await supabaseAdmin
        .from('usuarios')
        .select('id, nombre, rol_id, cargo_id, aprobado, created_at, auth_user_id, cargos(nombre), roles(nombre)')
        .order('aprobado', { ascending: true })
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { data: authData } = await supabaseAdmin.auth.admin.listUsers()

    const usuariosConCorreo = usuarios.map((usuario) => {
        const authUser = authData?.users?.find((u) => u.id === usuario.auth_user_id)
        return { ...usuario, correo: authUser?.email || '' }
    })

    return NextResponse.json({ usuarios: usuariosConCorreo })

}

export async function PATCH(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { usuarioId, rolId, cargoId } = await request.json()

    const {
        data: usuario,
        error
    } = await supabaseAdmin
        .from('usuarios')
        .update({ rol_id: rolId, cargo_id: cargoId, aprobado: true })
        .eq('id', usuarioId)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ usuario })

}