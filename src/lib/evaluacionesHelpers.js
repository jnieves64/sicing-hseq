export const MIN_OPCIONES = 2
export const MAX_OPCIONES = 6
export const OPCIONES_INICIALES = 4

let contador = 0

// Ids temporales del cliente (nunca se envían al servidor)
export function nuevoUid(prefijo = 'u') {
    contador += 1
    return `${prefijo}_${Date.now().toString(36)}${contador}`
}

export function crearOpcion(texto = '', esCorrecta = false) {
    return { uid: nuevoUid('o'), texto, es_correcta: esCorrecta }
}

export function crearOpcionesVacias() {
    return Array.from({ length: OPCIONES_INICIALES }, () => crearOpcion())
}

// Verdadero/Falso: la primera opción es Verdadero y la segunda Falso
export function crearOpcionesVF() {
    return [crearOpcion('Verdadero'), crearOpcion('Falso')]
}

export function crearPregunta(tipo = 'opcion') {
    return {
        uid: nuevoUid('p'),
        tipo,
        enunciado: '',
        justificacion: '',
        opciones: tipo === 'verdadero_falso' ? crearOpcionesVF() : crearOpcionesVacias()
    }
}

export function duplicarPregunta(pregunta) {
    return {
        ...pregunta,
        uid: nuevoUid('p'),
        opciones: pregunta.opciones.map((o) => ({ ...o, uid: nuevoUid('o') }))
    }
}

export function tieneContenido(pregunta) {
    return (
        pregunta.enunciado.trim() !== '' ||
        pregunta.justificacion.trim() !== '' ||
        (pregunta.tipo === 'opcion' && pregunta.opciones.some((o) => o.texto.trim() !== ''))
    )
}

// De lo que devuelve getEvaluacionAdminPorId al estado del formulario
export function preguntasDesdeServidor(preguntas = []) {
    return preguntas.map((p) => ({
        uid: nuevoUid('p'),
        tipo: p.tipo,
        enunciado: p.enunciado || '',
        justificacion: p.justificacion || '',
        opciones: p.opciones.map((o) => ({
            uid: nuevoUid('o'),
            texto: o.texto,
            es_correcta: o.es_correcta === true
        }))
    }))
}

// Del estado del formulario al cuerpo que espera la API (sin uids)
export function preguntasParaEnviar(preguntas) {
    return preguntas.map((p) => ({
        enunciado: p.enunciado.trim(),
        tipo: p.tipo,
        justificacion: p.justificacion.trim(),
        opciones: p.opciones.map((o) => ({
            texto: o.texto.trim(),
            es_correcta: o.es_correcta === true
        }))
    }))
}

// Devuelve un mensaje de error o null
export function validarPreguntasFormulario(preguntas) {

    if (preguntas.length === 0) {
        return 'Agrega al menos una pregunta.'
    }

    for (let i = 0; i < preguntas.length; i++) {

        const p = preguntas[i]
        const n = i + 1

        if (!p.enunciado.trim()) {
            return `La pregunta ${n} no tiene enunciado.`
        }

        if (p.tipo === 'opcion' && p.opciones.some((o) => !o.texto.trim())) {
            return `La pregunta ${n} tiene opciones vacías.`
        }

        if (p.opciones.filter((o) => o.es_correcta).length !== 1) {
            return `Marca la respuesta correcta de la pregunta ${n}.`
        }

    }

    return null

}