// SOLO SERVIDOR: usa service_role. Importar únicamente desde API routes,
// nunca desde componentes o servicios de cliente.
import { supabaseAdmin } from '@/lib/adminAuth'

const TIPOS = ['opcion', 'verdadero_falso']
const MIN_OPCIONES = 2
const MAX_OPCIONES = 6

export function texto(valor) {
    return String(valor ?? '').trim()
}

export function validarCategorias(categorias) {

    if (categorias === undefined) return null

    if (!Array.isArray(categorias) || categorias.some((c) => !Number.isInteger(c))) {
        return 'Las categorías no son válidas.'
    }

    return null

}

// Devuelve un mensaje de error o null si todo está bien.
// Formato esperado de cada pregunta:
// { enunciado, tipo: 'opcion' | 'verdadero_falso', justificacion?,
//   opciones: [{ texto, es_correcta }] }
// En verdadero_falso: 2 opciones; la primera es Verdadero y la segunda Falso.
export function validarPreguntas(preguntas) {

    if (!Array.isArray(preguntas) || preguntas.length === 0) {
        return 'La evaluación debe tener al menos una pregunta.'
    }

    for (let i = 0; i < preguntas.length; i++) {

        const p = preguntas[i]
        const n = i + 1

        if (!texto(p?.enunciado)) {
            return `La pregunta ${n} no tiene enunciado.`
        }

        if (!TIPOS.includes(p.tipo)) {
            return `La pregunta ${n} tiene un tipo no válido.`
        }

        if (!Array.isArray(p.opciones)) {
            return `La pregunta ${n} no tiene opciones.`
        }

        if (p.tipo === 'verdadero_falso') {

            if (p.opciones.length !== 2) {
                return `La pregunta ${n} (verdadero/falso) debe tener exactamente 2 opciones.`
            }

        } else {

            if (p.opciones.length < MIN_OPCIONES || p.opciones.length > MAX_OPCIONES) {
                return `La pregunta ${n} debe tener entre ${MIN_OPCIONES} y ${MAX_OPCIONES} opciones.`
            }

            if (p.opciones.some((o) => !texto(o?.texto))) {
                return `La pregunta ${n} tiene opciones vacías.`
            }

        }

        const correctas = p.opciones.filter((o) => o?.es_correcta === true).length

        if (correctas !== 1) {
            return `La pregunta ${n} debe tener exactamente una respuesta correcta.`
        }

    }

    return null

}

export async function contarIntentos(evaluacionId) {

    const { count, error } = await supabaseAdmin
        .from('intentos')
        .select('id', { count: 'exact', head: true })
        .eq('evaluacion_id', evaluacionId)

    if (error) return { total: 0, error: error.message }

    return { total: count || 0, error: null }

}

export async function guardarCategorias(evaluacionId, categorias) {

    const { error: borrarError } = await supabaseAdmin
        .from('evaluacion_categorias')
        .delete()
        .eq('evaluacion_id', evaluacionId)

    if (borrarError) return { error: borrarError.message }

    if (!categorias || categorias.length === 0) return { error: null }

    const filas = categorias.map((categoriaId) => ({
        evaluacion_id: evaluacionId,
        categoria_id: categoriaId
    }))

    const { error: insertarError } = await supabaseAdmin
        .from('evaluacion_categorias')
        .insert(filas)

    if (insertarError) return { error: insertarError.message }

    return { error: null }

}

// Inserta las preguntas nuevas y SOLO después borra las anteriores,
// así un fallo a mitad de camino no deja la evaluación sin preguntas.
export async function reemplazarPreguntas(evaluacionId, preguntas) {

    const { data: viejas, error: viejasError } = await supabaseAdmin
        .from('preguntas')
        .select('id')
        .eq('evaluacion_id', evaluacionId)

    if (viejasError) return { error: viejasError.message }

    const idsViejos = (viejas || []).map((p) => p.id)

    const filasPreguntas = preguntas.map((p, index) => ({
        evaluacion_id: evaluacionId,
        enunciado: texto(p.enunciado),
        tipo: p.tipo,
        orden: index + 1,
        justificacion: texto(p.justificacion) || null
    }))

    const { data: nuevas, error: preguntasError } = await supabaseAdmin
        .from('preguntas')
        .insert(filasPreguntas)
        .select('id, orden')

    if (preguntasError) return { error: preguntasError.message }

    const idsNuevos = nuevas.map((p) => p.id)

    const filasOpciones = []

    for (const nueva of nuevas) {

        const origen = preguntas[nueva.orden - 1]

        const opciones = origen.tipo === 'verdadero_falso'
            ? [
                { texto: 'Verdadero', es_correcta: origen.opciones[0].es_correcta === true },
                { texto: 'Falso', es_correcta: origen.opciones[1].es_correcta === true }
            ]
            : origen.opciones.map((o) => ({
                texto: texto(o.texto),
                es_correcta: o.es_correcta === true
            }))

        opciones.forEach((o, index) => {
            filasOpciones.push({
                pregunta_id: nueva.id,
                texto: o.texto,
                es_correcta: o.es_correcta,
                orden: index + 1
            })
        })

    }

    const { error: opcionesError } = await supabaseAdmin
        .from('opciones')
        .insert(filasOpciones)

    if (opcionesError) {
        await supabaseAdmin.from('preguntas').delete().in('id', idsNuevos)
        return { error: opcionesError.message }
    }

    if (idsViejos.length > 0) {

        const { error: borrarError } = await supabaseAdmin
            .from('preguntas')
            .delete()
            .in('id', idsViejos)

        if (borrarError) {
            await supabaseAdmin.from('preguntas').delete().in('id', idsNuevos)
            return { error: borrarError.message }
        }

    }

    return { error: null }

}

// Borra la evaluación; las FK con ON DELETE CASCADE limpian el resto.
export async function limpiarEvaluacion(evaluacionId) {
    await supabaseAdmin.from('evaluaciones').delete().eq('id', evaluacionId)
}