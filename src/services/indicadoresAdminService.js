import { supabase } from '@/lib/supabase'

async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession()
    return { Authorization: `Bearer ${session?.access_token}` }
}

export async function getIndicadoresAdmin() {

    const response = await fetch('/api/admin/indicadores', {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { indicadores: [], error: data?.error }
    }

    return { indicadores: data.indicadores, error: null }

}

export async function getIndicadorAdminPorId(id) {

    const response = await fetch(`/api/admin/indicadores/${id}`, {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { indicador: null, error: data?.error }
    }

    return { indicador: data.indicador, error: null }

}

export async function crearIndicador({ titulo, descripcion, columnas, filas, graficas, activo }) {

    const response = await fetch('/api/admin/indicadores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ titulo, descripcion, columnas, filas, graficas, activo })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { indicador: data.indicador, error: null }

}

export async function actualizarIndicador(id, { titulo, descripcion, columnas, filas, graficas, activo }) {

    const response = await fetch(`/api/admin/indicadores/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ titulo, descripcion, columnas, filas, graficas, activo })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

export async function toggleActivoIndicador(id, nuevoEstado) {

    const response = await fetch(`/api/admin/indicadores/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ activo: nuevoEstado })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

export async function eliminarIndicador(id) {

    const response = await fetch(`/api/admin/indicadores/${id}`, {
        method: 'DELETE',
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}