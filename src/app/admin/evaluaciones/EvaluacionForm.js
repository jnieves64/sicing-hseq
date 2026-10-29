'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import CategoriaCheckboxGroup from '@/app/admin/documentos/CategoriaCheckboxGroup'
import PreguntasEditor from './PreguntasEditor'
import {
    crearPregunta,
    preguntasDesdeServidor,
    preguntasParaEnviar,
    validarPreguntasFormulario
} from '@/lib/evaluacionesHelpers'

export default function EvaluacionForm({
    evaluacion,        // undefined = modo creación, objeto = modo edición
    categorias,
    onSubmit,          // crear: recibe { titulo, descripcion, codigo, activo, categorias, preguntas }
                       // editar: recibe { titulo, descripcion, codigo, categorias, preguntas? }
}) {

    const router = useRouter()
    const esEdicion = Boolean(evaluacion)

    // Con resultados registrados, las preguntas no se pueden modificar
    const resultados = evaluacion?.total_historial || 0
    const bloqueado = esEdicion && resultados > 0

    const [titulo, setTitulo] = useState(evaluacion?.titulo || '')
    const [descripcion, setDescripcion] = useState(evaluacion?.descripcion || '')
    const [codigo, setCodigo] = useState(evaluacion?.codigo || '')
    const [estado, setEstado] = useState('borrador')
    const [categoriaIds, setCategoriaIds] = useState(evaluacion?.categorias || [])
    const [preguntas, setPreguntas] = useState(() =>
        esEdicion
            ? preguntasDesdeServidor(evaluacion.preguntas)
            : [crearPregunta('opcion')]
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Enter dentro de un campo no debe enviar el formulario
    const evitarEnvioConEnter = (event) => {
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            event.preventDefault()
        }
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError('')

        if (!titulo.trim()) {
            setError('Debes ingresar el título de la evaluación.')
            return
        }

        if (!bloqueado) {
            const errorPreguntas = validarPreguntasFormulario(preguntas)
            if (errorPreguntas) {
                setError(errorPreguntas)
                return
            }
        }

        setLoading(true)

        const datos = {
            titulo,
            descripcion,
            codigo,
            categorias: categoriaIds,
            // undefined = el servidor no toca las preguntas
            preguntas: bloqueado ? undefined : preguntasParaEnviar(preguntas)
        }

        if (!esEdicion) {
            datos.activo = estado === 'publicada'
        }

        const { error } = await onSubmit(datos)

        setLoading(false)

        if (error) {
            setError(
                typeof error === 'string' && error
                    ? error
                    : 'No se pudo guardar la evaluación. Intenta de nuevo.'
            )
            return
        }

        router.push('/admin/evaluaciones')

    }

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={evitarEnvioConEnter}
            className="bg-white rounded-xl border border-gray-200 p-8 space-y-8"
        >

            {/* Aviso: evaluación con resultados */}
            {bloqueado && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                    Esta evaluación tiene {resultados} resultado{resultados === 1 ? '' : 's'} registrado{resultados === 1 ? '' : 's'}.
                    Solo puedes editar el título, la descripción, el código y las categorías. Para cambiar las preguntas,
                    crea una evaluación nueva.
                </div>
            )}

            {/* Información de la evaluación */}
            <div className="space-y-5">

                <h2 className="text-base font-semibold text-black">Información de la evaluación</h2>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(event) => setTitulo(event.target.value)}
                        disabled={loading}
                        placeholder="Ej. Evaluación PTS Soldadura"
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        disabled={loading}
                        rows={3}
                        placeholder="Describe brevemente el tema y el propósito de la evaluación..."
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Código (opcional)</label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(event) => setCodigo(event.target.value)}
                            disabled={loading}
                            placeholder="Ej. SING-PT-GO-SIG-013"
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Estado de publicación</label>

                        {esEdicion ? (
                            <>
                                <p className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-100 text-gray-600">
                                    {evaluacion.activo ? 'Publicada' : 'Borrador'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Se cambia desde el listado con Publicar o Despublicar.
                                </p>
                            </>
                        ) : (
                            <select
                                value={estado}
                                onChange={(event) => setEstado(event.target.value)}
                                disabled={loading}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                            >
                                <option value="borrador">Borrador</option>
                                <option value="publicada">Publicada</option>
                            </select>
                        )}
                    </div>

                </div>

            </div>

            {/* Categorías */}
            <div className="space-y-3">
                <h2 className="text-base font-semibold text-black">Categorías</h2>
                <p className="text-sm text-gray-500">Opcional. Sirven para agrupar y filtrar las evaluaciones.</p>

                <CategoriaCheckboxGroup
                    categorias={categorias}
                    selected={categoriaIds}
                    onChange={setCategoriaIds}
                />
            </div>

            {/* Preguntas */}
            <PreguntasEditor
                preguntas={preguntas}
                onChange={setPreguntas}
                bloqueado={bloqueado}
            />

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.push('/admin/evaluaciones')}
                    disabled={loading}
                    className="text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="text-sm font-medium px-6 py-2.5 rounded-lg bg-[#ebbb18] hover:brightness-95 disabled:opacity-60"
                >
                    {loading
                        ? 'Guardando...'
                        : esEdicion ? 'Guardar cambios' : 'Crear evaluación'
                    }
                </button>
            </div>

        </form>
    )

}