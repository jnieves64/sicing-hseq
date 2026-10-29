'use client'

import PreguntaEditor from './PreguntaEditor'
import { crearPregunta, duplicarPregunta, tieneContenido } from '@/lib/evaluacionesHelpers'

export default function PreguntasEditor({ preguntas, onChange, bloqueado }) {

    const actualizar = (uid, nueva) => {
        onChange(preguntas.map((p) => p.uid === uid ? nueva : p))
    }

    const mover = (index, direccion) => {

        const destino = index + direccion

        if (destino < 0 || destino >= preguntas.length) return

        const copia = [...preguntas]
        ;[copia[index], copia[destino]] = [copia[destino], copia[index]]
        onChange(copia)

    }

    const duplicar = (index) => {
        const copia = [...preguntas]
        copia.splice(index + 1, 0, duplicarPregunta(preguntas[index]))
        onChange(copia)
    }

    const eliminar = (index) => {

        if (tieneContenido(preguntas[index]) &&
            !window.confirm('¿Seguro que quieres eliminar esta pregunta?')) {
            return
        }

        onChange(preguntas.filter((_, i) => i !== index))

    }

    const agregar = (tipo) => {
        onChange([...preguntas, crearPregunta(tipo)])
    }

    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-black">Preguntas</h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    {preguntas.length} pregunta{preguntas.length === 1 ? '' : 's'}
                </span>
            </div>

            {preguntas.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6">
                    <p className="text-center text-sm text-gray-400">
                        Aún no hay preguntas. Agrega la primera.
                    </p>
                </div>
            )}

            {preguntas.map((pregunta, index) => (
                <PreguntaEditor
                    key={pregunta.uid}
                    pregunta={pregunta}
                    numero={index + 1}
                    total={preguntas.length}
                    bloqueado={bloqueado}
                    onChange={(nueva) => actualizar(pregunta.uid, nueva)}
                    onMover={(direccion) => mover(index, direccion)}
                    onDuplicar={() => duplicar(index)}
                    onEliminar={() => eliminar(index)}
                />
            ))}

            {!bloqueado && (
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => agregar('opcion')}
                        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        + Pregunta de opción
                    </button>
                    <button
                        type="button"
                        onClick={() => agregar('verdadero_falso')}
                        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        + Verdadero / Falso
                    </button>
                </div>
            )}

        </div>
    )

}