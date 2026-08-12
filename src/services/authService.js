import { supabase } from '@/lib/supabase'

/**
 * Inicia sesión utilizando Supabase Auth.
 */
export async function login(email, password) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return {
        data,
        error
    }

}

/**
 * Cierra la sesión actual.
 */
export async function logout() {

    const { error } = await supabase.auth.signOut()

    return {
        error
    }

}

/**
 * Obtiene la sesión activa de Supabase.
 */
export async function getSession() {

    const { data, error } = await supabase.auth.getSession()

    return {
        session: data.session,
        error
    }

}

/**
 * Obtiene el perfil del usuario desde la tabla usuarios.
 */
/**
 * Obtiene el perfil del usuario desde la tabla usuarios.
 */
/**
 * Obtiene el perfil del usuario junto con su rol.
 */
export async function getProfile(authUserId) {

    // Buscar usuario
    const {
        data: user,
        error: userError
    } = await supabase
        .from('usuarios')
        .select(`
            id,
            nombre,
            rol_id,
            cargo_id,
            activo,
            aprobado
        `)
        .eq('auth_user_id', authUserId)
        .single()

    if (userError) {
        return {
            profile: null,
            error: userError
        }
    }

    if (!user.aprobado) {
        return {
            profile: {
                id: user.id,
                nombre: user.nombre,
                activo: user.activo,
                aprobado: false,
                rol: null,
                cargo: null
            },
            error: null
        }
    }

    // Buscar rol
    const {
        data: role,
        error: roleError
    } = await supabase
        .from("roles")
        .select("id,nombre")
        .eq("id", user.rol_id)
        .single()

    // Buscar cargo (puede ser null, ya que cargo_id es opcional)
    const {
        data: cargo
    } = await supabase
        .from("cargos")
        .select("id,nombre")
        .eq("id", user.cargo_id)
        .single()

    if (roleError) {
        return {
            profile: {
                ...user,
                rol: null,
                cargo: cargo || null
            },
            error: null
        }
    }

    return {
        profile: {
            id: user.id,
            nombre: user.nombre,
            activo: user.activo,
            aprobado: true,
            rol: role,
            cargo: cargo || null
        },
        error: null
    }

}