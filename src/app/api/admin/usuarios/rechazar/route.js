import { NextResponse } from 'next/server'
import { supabaseAdmin, verificarAdmin } from '@/lib/adminAuth'

export async function POST(request) {

    const { autorizado } = await verificarAdmin(request)

    if (!autorizado) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { usuarioId } = await request.json()

    // Buscamos el auth_user_id antes de borrar, para poder
    // eliminar también el registro en Supabase Auth.
    const {
        data: usuario,
        error: fetchError
    } = await supabaseAdmin
        .from('usuarios')
        .select('auth_user_id')
        .eq('id', usuarioId)
        .single()

    if (fetchError || !usuario) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const {
        error: deleteUsuarioError
    } = await supabaseAdmin
        .from('usuarios')
        .delete()
        .eq('id', usuarioId)

    if (deleteUsuarioError) {
        return NextResponse.json({ error: deleteUsuarioError.message }, { status: 400 })
    }

    const {
        error: deleteAuthError
    } = await supabaseAdmin.auth.admin.deleteUser(usuario.auth_user_id)

    if (deleteAuthError) {
        // El registro de usuarios ya se borró; si falla el de Auth,
        // devolvemos el error pero no revertimos, ya que lo prioritario
        // es que el usuario no quede con acceso residual a la tabla usuarios.
        return NextResponse.json({ error: deleteAuthError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}