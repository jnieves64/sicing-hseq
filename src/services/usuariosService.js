import { supabase } from '@/lib/supabase'

/**
 * Registra un nuevo usuario: crea la cuenta en Supabase Auth
 * y el registro correspondiente en la tabla usuarios, con
 * aprobado = false y rol_id = null hasta que un administrador lo apruebe.
 */
export async function registrarUsuario({ nombre, email, password, cargo_id }) {

    const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, cargo_id })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error || new Error('No se pudo completar el registro.') }
    }

    return { usuario: data, error: null }

}

/**
 * Obtiene la lista de usuarios pendientes de aprobación,
 * incluyendo el nombre del cargo que seleccionaron al registrarse.
 */
export async function getUsuariosPendientes() {

    const {
        data: usuarios,
        error
    } = await supabase
        .from('usuarios')
        .select('id, nombre, created_at, cargo_id, cargos(nombre)')
        .eq('aprobado', false)
        .order('created_at', { ascending: true })

    return { usuarios: usuarios || [], error }

}

/**
 * Aprueba un usuario pendiente, asignándole el rol elegido por el administrador.
 */
export async function aprobarUsuario(usuarioId, rolId) {

    const {
        data: usuario,
        error
    } = await supabase
        .from('usuarios')
        .update({
            aprobado: true,
            rol_id: rolId
        })
        .eq('id', usuarioId)
        .select()
        .single()

    return { usuario, error }

}

/**
 * Rechaza un usuario pendiente. Esto requiere eliminar también
 * el registro en auth.users, lo cual no se puede hacer desde el
 * cliente con la anon key — se delega a una API route protegida.
 */
export async function rechazarUsuario(usuarioId) {

    const response = await fetch('/api/admin/usuarios/rechazar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error || new Error('No se pudo rechazar el usuario.') }
    }

    return { error: null }

}

/**
 * Obtiene la lista de cargos activos, para poblar el select
 * del formulario de registro.
 */
export async function getCargos() {

    const {
        data: cargos,
        error
    } = await supabase
        .from('cargos')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre', { ascending: true })

    return { cargos: cargos || [], error }

}