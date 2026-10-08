import { supabase } from '@/lib/supabase'

async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession()
    return { Authorization: `Bearer ${session?.access_token}` }
}

export async function getCampanasAdmin() {

    const response = await fetch('/api/admin/campanas', {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { campanas: [], error: data?.error }
    }

    const campanas = data.campanas.map((c) => ({
        ...c,
        medios: [...c.campana_medios].sort((a, b) => a.orden - b.orden)
    }))

    return { campanas, error: null }

}

export async function getCampanaPorId(campanaId) {

    const response = await fetch(`/api/admin/campanas/${campanaId}`, {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { campana: null, error: data?.error }
    }

    const campana = {
        ...data.campana,
        medios: [...data.campana.campana_medios].sort((a, b) => a.orden - b.orden)
    }

    return { campana, error: null }

}

export async function crearCampana({ descripcion, tipo, activo, urls }) {

    const response = await fetch('/api/admin/campanas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ descripcion, tipo, activo, urls })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { campana: data.campana, error: null }

}

export async function actualizarCampana(campanaId, { descripcion, tipo, activo, urls }) {

    const response = await fetch(`/api/admin/campanas/${campanaId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ descripcion, tipo, activo, urls })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

export async function toggleActivoCampana(campanaId, nuevoEstado) {

    const response = await fetch(`/api/admin/campanas/${campanaId}`, {
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

export async function moverCampana(campanaId, direccion) {

    const response = await fetch('/api/admin/campanas/reordenar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ campanaId, direccion })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

export async function eliminarCampana(campanaId) {

    const response = await fetch(`/api/admin/campanas/${campanaId}`, {
        method: 'DELETE',
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}