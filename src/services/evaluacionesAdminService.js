import { supabase } from '@/lib/supabase'

async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession()
    return { Authorization: `Bearer ${session?.access_token}` }
}

export async function getEvaluacionesAdmin() {

    const response = await fetch('/api/admin/evaluaciones', {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { evaluaciones: [], error: data?.error }
    }

    return { evaluaciones: data.evaluaciones, error: null }

}

export async function getEvaluacionAdminPorId(evaluacionId) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}`, {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { evaluacion: null, error: data?.error }
    }

    const evaluacion = {
        ...data.evaluacion,
        categorias: data.evaluacion.evaluacion_categorias.map((c) => c.categoria_id),
        preguntas: [...data.evaluacion.preguntas]
            .sort((a, b) => a.orden - b.orden)
            .map((p) => ({
                ...p,
                opciones: [...p.opciones].sort((a, b) => a.orden - b.orden)
            }))
    }

    return { evaluacion, error: null }

}

export async function crearEvaluacion({ titulo, descripcion, codigo, activo, categorias, preguntas, min_correctas }) {

    const response = await fetch('/api/admin/evaluaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ titulo, descripcion, codigo, activo, categorias, preguntas, min_correctas })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { evaluacion: data.evaluacion, error: null }

}

export async function actualizarEvaluacion(evaluacionId, { titulo, descripcion, codigo, categorias, preguntas, min_correctas }) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ titulo, descripcion, codigo, categorias, preguntas, min_correctas })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

export async function toggleActivoEvaluacion(evaluacionId, nuevoEstado) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}`, {
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

export async function eliminarEvaluacion(evaluacionId) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}`, {
        method: 'DELETE',
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error }
    }

    return { error: null }

}

// Resultados de una evaluación: { evaluacion, resultados, pendientes }
export async function getResultadosEvaluacion(evaluacionId) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}/resultados`, {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { dato: null, error: data?.error || 'Error' }
    }

    return { dato: data, error: null }

}

export async function habilitarNuevoIntento(evaluacionId, usuarioId) {

    const response = await fetch(`/api/admin/evaluaciones/${evaluacionId}/habilitar-intento`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ usuarioId })
    })

    const data = await response.json()

    if (!response.ok) {
        return { error: data?.error || 'Error' }
    }

    return { error: null }

}