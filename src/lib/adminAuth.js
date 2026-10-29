import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function verificarAdmin(request) {

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
        return { autorizado: false, usuarioId: null }
    }

    const {
        data: { user },
        error: userError
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
        return { autorizado: false, usuarioId: null }
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
        return { autorizado: false, usuarioId: null }
    }

    return { autorizado: true, usuarioId: perfil.id }

}

// Cualquier usuario con sesión y APROBADO (visualizador o administrador).
// Devuelve esAdmin para que las rutas decidan qué mostrar o guardar.
export async function verificarUsuario(request) {

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
        return { autorizado: false, usuarioId: null, esAdmin: false }
    }

    const {
        data: { user },
        error: userError
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
        return { autorizado: false, usuarioId: null, esAdmin: false }
    }

    const {
        data: perfil,
        error: perfilError
    } = await supabaseAdmin
        .from('usuarios')
        .select('id, aprobado, roles(nombre)')
        .eq('auth_user_id', user.id)
        .single()

    if (perfilError || !perfil || perfil.aprobado !== true) {
        return { autorizado: false, usuarioId: null, esAdmin: false }
    }

    return {
        autorizado: true,
        usuarioId: perfil.id,
        esAdmin: perfil.roles?.nombre === 'administrador'
    }

}