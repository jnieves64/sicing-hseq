import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {

    const { nombre, email, password, cargo_id } = await request.json()

    const {
        data: authData,
        error: authError
    } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true // se crea ya confirmado, no aplica el flujo de confirmación
    })

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const {
        error: usuarioError
    } = await supabaseAdmin
        .from('usuarios')
        .insert({
            nombre,
            auth_user_id: authData.user.id,
            cargo_id,
            rol_id: null,
            aprobado: false,
            activo: true
        })

    if (usuarioError) {
        // si falla el insert en usuarios, deshacemos el usuario de Auth
        // para no dejar huérfanos
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: usuarioError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

}