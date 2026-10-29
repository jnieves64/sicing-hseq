import { supabase } from '@/lib/supabase'

async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession()
    return { Authorization: `Bearer ${session?.access_token}` }
}

export async function getEvaluaciones() {

    const response = await fetch('/api/evaluaciones', {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { evaluaciones: [], esAdmin: false, error: data?.error || 'Error' }
    }

    return { evaluaciones: data.evaluaciones, esAdmin: data.esAdmin === true, error: null }

}

// Preguntas (sin respuestas correctas) o, si ya la presentó, su resultado
export async function getEvaluacionParaPresentar(evaluacionId) {

    const response = await fetch(`/api/evaluaciones/${evaluacionId}`, {
        headers: await authHeader()
    })

    const data = await response.json()

    if (!response.ok) {
        return { dato: null, error: data?.error || 'Error', status: response.status }
    }

    return { dato: data, error: null, status: response.status }

}

// respuestas: [{ preguntaId, opcionIds: [...] }]
export async function enviarRespuestas(evaluacionId, respuestas) {

    const response = await fetch(`/api/evaluaciones/${evaluacionId}/responder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader())
        },
        body: JSON.stringify({ respuestas })
    })

    const data = await response.json()

    if (!response.ok) {
        return { dato: null, error: data?.error || 'Error', status: response.status }
    }

    return { dato: data, error: null, status: response.status }

}