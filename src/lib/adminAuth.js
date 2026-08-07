import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function verificarAdmin(request) {

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
        return { autorizado: false }
    }

    const {
        data: { user },
        error: userError
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
        return { autorizado: false }
    }

    const {
        data: perfil,
        error: perfilError
    } = await supabaseAdmin
        .from('usuarios')
        .select('id, rol_id, roles(nombre)')
        .eq('auth_user_id', user.id)
        .single()

    if (perfilError || perfil?.roles?.nombre !== 'administrador') {
        return { autorizado: false }
    }

    return { autorizado: true }

}