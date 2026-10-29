'use client'

import {
    MIN_OPCIONES,
    MAX_OPCIONES,
    crearOpcion,
    crearOpcionesVF,
    crearOpcionesVacias
} from '@/lib/evaluacionesHelpers'

const ETIQUETA_TIPO = {
    opcion: 'Opción',
    verdadero_falso: 'Verdadero / Falso'
}

const BOTON = 'text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'
const BOTON_ELIMINAR = 'text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200'

export default function PreguntaEditor({
    pregunta,
    numero,
    total,
    bloqueado,
    onChange,
    onMover,
    onDuplicar,
    onEliminar
}) {

    // Evaluación con resultados: solo lectura
    if (bloqueado) {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-3">

                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-black">Pregunta {numero}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                        {ETIQUETA_TIPO[pregunta.tipo]}
                    </span>
                </div>

                <p className="text-sm text-gray-800">{pregunta.enunciado}</p>

                <ul className="space-y-1.5">
                    {pregunta.opciones.map((opcion) => (
                        <li
                            key={opcion.uid}
                            className={`
                                flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-lg border
                                ${opcion.es_correcta
                                    ? 'border-green-300 bg-green-50 text-green-800'
                                    : 'border-gray-200 bg-white text-gray-700'}
                            `}
                        >
                            <span>{opcion.texto}</span>
                            {opcion.es_correcta && (
                                <span className="text-xs font-medium shrink-0">Correcta</span>
                            )}
                        </li>
                    ))}
                </ul>

                {pregunta.justificacion && (
                    <p className="text-xs text-gray-500">
                        <span className="font-medium">Justificación:</span> {pregunta.justificacion}
                    </p>
                )}

            </div>
        )
    }

    const cambiarCampo = (campo, valor) => {
        onChange({ ...pregunta, [campo]: valor })
    }

    const cambiarTipo = (nuevoTipo) => {

        if (nuevoTipo === pregunta.tipo) return

        const hayTexto = pregunta.tipo === 'opcion' &&
            pregunta.opciones.some((o) => o.texto.trim() !== '')

        if (hayTexto && !window.confirm('Al cambiar el tipo se perderán las opciones escritas. ¿Continuar?')) {
            return
        }

        onChange({
            ...pregunta,
            tipo: nuevoTipo,
            opciones: nuevoTipo === 'verdadero_falso' ? crearOpcionesVF() : crearOpcionesVacias()
        })

    }

    const cambiarTextoOpcion = (uid, texto) => {
        onChange({
            ...pregunta,
            opciones: pregunta.opciones.map((o) => o.uid === uid ? { ...o, texto } : o)
        })
    }

    const marcarCorrecta = (uid) => {
        onChange({
            ...pregunta,
            opciones: pregunta.opciones.map((o) => ({ ...o, es_correcta: o.uid === uid }))
        })
    }

    const agregarOpcion = () => {
        if (pregunta.opciones.length >= MAX_OPCIONES) return
        onChange({ ...pregunta, opciones: [...pregunta.opciones, crearOpcion()] })
    }

    const quitarOpcion = (uid) => {
        if (pregunta.opciones.length <= MIN_OPCIONES) return
        onChange({ ...pregunta, opciones: pregunta.opciones.filter((o) => o.uid !== uid) })
    }

    const nombreRadio = `correcta-${pregunta.uid}`

    return (
        <div className="rounded-xl border border-gray-200 p-5 space-y-4">

            {/* Encabezado: número, tipo y acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-black">Pregunta {numero}</p>
                    <select
                        value={pregunta.tipo}
                        onChange={(event) => cambiarTipo(event.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-gray-50"
                    >
                        <option value="opcion">Opción</option>
                        <option value="verdadero_falso">Verdadero / Falso</option>
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onMover(-1)}
                        disabled={numero === 1}
                        title="Subir"
                        className={BOTON}
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        onClick={() => onMover(1)}
                        disabled={numero === total}
                        title="Bajar"
                        className={BOTON}
                    >
                        ↓
                    </button>
                    <button type="button" onClick={onDuplicar} className={BOTON}>
                        Duplicar
                    </button>
                    <button type="button" onClick={onEliminar} className={BOTON_ELIMINAR}>
                        Eliminar
                    </button>
                </div>

            </div>

            {/* Enunciado */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Enunciado</label>
                <textarea
                    value={pregunta.enunciado}
                    onChange={(event) => cambiarCampo('enunciado', event.target.value)}
                    rows={2}
                    placeholder="Escribe la pregunta..."
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-none"
                />
            </div>

            {/* Respuestas */}
            <div className="flex flex-col gap-2">

                <label className="text-sm font-medium text-gray-700">Respuestas</label>

                {pregunta.tipo === 'verdadero_falso' ? (

                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {pregunta.opciones.map((opcion) => (
                                <label
                                    key={opcion.uid}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer
                                        ${opcion.es_correcta ? 'border-[#ebbb18] bg-[#ebbb18]/10' : 'border-gray-200 bg-white'}
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name={nombreRadio}
                                        checked={opcion.es_correcta}
                                        onChange={() => marcarCorrecta(opcion.uid)}
                                        className="w-4 h-4 accent-[#ebbb18]"
                                    />
                                    <span className="text-sm text-gray-800">{opcion.texto}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">Marca cuál es la respuesta correcta.</p>
                    </>

                ) : (

                    <>
                        <div className="space-y-2">
                            {pregunta.opciones.map((opcion, index) => (
                                <div key={opcion.uid} className="flex items-center gap-2">

                                    <input
                                        type="radio"
                                        name={nombreRadio}
                                        checked={opcion.es_correcta}
                                        onChange={() => marcarCorrecta(opcion.uid)}
                                        aria-label={`Marcar la opción ${index + 1} como correcta`}
                                        className="w-4 h-4 accent-[#ebbb18] shrink-0"
                                    />

                                    <input
                                        type="text"
                                        value={opcion.texto}
                                        onChange={(event) => cambiarTextoOpcion(opcion.uid, event.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => quitarOpcion(opcion.uid)}
                                        disabled={pregunta.opciones.length <= MIN_OPCIONES}
                                        aria-label={`Quitar la opción ${index + 1}`}
                                        title="Quitar opción"
                                        className={`${BOTON} shrink-0`}
                                    >
                                        ✕
                                    </button>

                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-gray-400">
                                Marca con el círculo la respuesta correcta. De {MIN_OPCIONES} a {MAX_OPCIONES} opciones.
                            </p>
                            <button
                                type="button"
                                onClick={agregarOpcion}
                                disabled={pregunta.opciones.length >= MAX_OPCIONES}
                                className={BOTON}
                            >
                                + Agregar opción
                            </button>
                        </div>
                    </>

                )}

            </div>

            {/* Justificación (solo administrador) */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Justificación (opcional)</label>
                <textarea
                    value={pregunta.justificacion}
                    onChange={(event) => cambiarCampo('justificacion', event.target.value)}
                    rows={2}
                    placeholder="Por qué esta es la respuesta correcta..."
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 resize-none"
                />
                <p className="text-xs text-gray-400">Solo la ven los administradores; nunca se muestra a quien presenta la evaluación.</p>
            </div>

        </div>
    )

}