'use client'

import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'

import TablasEditor from './TablasEditor'
import GraficasEditor from './GraficasEditor'

import {
    crearTablaVacia,
    tablaATexto,
    tablaParaVistaPrevia,
    prepararTablasParaGuardar,
    limpiarGraficas,
    validarGraficas,
    esFilaSeccion
} from '@/lib/indicadoresHelpers'

// Resumen de la estructura de las tablas (ids, columnas, formatos y filas de datos).
// Solo cuando cambia se limpian las gráficas, no en cada tecla.
function firmaDeEstructura(tablas) {
    return tablas
        .map((tabla) =>
            [
                tabla.id,
                tabla.formatoPor,
                tabla.columnas.map((columna) => `${columna.key}:${columna.formato}`).join(','),
                tabla.filas.filter((fila) => !esFilaSeccion(fila)).map((fila) => fila._id).join(',')
            ].join('|')
        )
        .join('||')
}

export default function IndicadorForm({ indicador, onSubmit }) {

    const router = useRouter()
    const esEdicion = Boolean(indicador)

    const [titulo, setTitulo] = useState(indicador?.titulo || '')
    const [descripcion, setDescripcion] = useState(indicador?.descripcion || '')
    const [activo, setActivo] = useState(indicador?.activo ?? true)

    const [tablas, setTablas] = useState(() =>
        indicador?.tablas?.length
            ? indicador.tablas.map(tablaATexto)
            : [crearTablaVacia('t1')]
    )

    const [graficas, setGraficas] = useState(indicador?.graficas ?? [])

    const firmaAnterior = useRef(firmaDeEstructura(tablas))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Tablas con valores tipados "a la ligera" para que las vistas previas
    // se actualicen mientras se escribe, sin lanzar errores.
    const tablasVistaPrevia = useMemo(
        () => tablas.map(tablaParaVistaPrevia),
        [tablas]
    )

    const handleTablasChange = (nuevasTablas) => {

        // Si cambió la estructura (tablas, columnas, filas o formatos), las gráficas
        // dejan de apuntar a cosas que ya no existen.
        const firma = firmaDeEstructura(nuevasTablas)

        if (firma !== firmaAnterior.current) {
            firmaAnterior.current = firma
            setGraficas((actuales) => limpiarGraficas(actuales, nuevasTablas))
        }

        setTablas(nuevasTablas)

    }

    // Evita que Enter dentro de un campo envíe el formulario sin querer
    const evitarEnvioConEnter = (event) => {
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            event.preventDefault()
        }
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError('')

        if (!titulo.trim()) {
            setError('Debes ingresar el título del indicador.')
            return
        }

        const resultado = prepararTablasParaGuardar(tablas)

        if (resultado.error) {
            setError(resultado.error)
            return
        }

        const graficasLimpias = limpiarGraficas(
            graficas.map((grafica) => ({ ...grafica, tabla: grafica.tabla ?? tablas[0].id })),
            resultado.tablas
        )

        const errorGraficas = validarGraficas(graficasLimpias)

        if (errorGraficas) {
            setError(errorGraficas)
            return
        }

        setLoading(true)

        const { error } = await onSubmit({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            tablas: resultado.tablas,
            graficas: graficasLimpias.map((grafica) => ({
                ...grafica,
                titulo: grafica.titulo.trim()
            })),
            activo
        })

        setLoading(false)

        if (error) {
            setError('No se pudo guardar el indicador. Intenta de nuevo.')
            return
        }

        router.push('/admin/indicadores')

    }

    return (
        <form onSubmit={handleSubmit} onKeyDown={evitarEnvioConEnter} className="space-y-6">

            {/* Información del indicador */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-5">

                <div>
                    <h2 className="text-base font-semibold text-black">Información del indicador</h2>
                    <p className="text-sm text-gray-500 mt-1">Define los datos generales que verán los usuarios.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(event) => setTitulo(event.target.value)}
                            disabled={loading}
                            placeholder="Ej. Panel de indicadores clave financieros"
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Estado</label>
                        <select
                            value={activo ? 'activo' : 'inactivo'}
                            onChange={(event) => setActivo(event.target.value === 'activo')}
                            disabled={loading}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        disabled={loading}
                        rows={3}
                        placeholder="Describe brevemente el objetivo de este indicador"
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 disabled:opacity-60 resize-none"
                    />
                </div>

            </section>

            {/* Datos */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-5">

                <div>
                    <h2 className="text-base font-semibold text-black">Datos</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Carga y estructura la información que alimentará tus gráficas. Un indicador puede tener varias tablas.
                    </p>
                </div>

                <TablasEditor
                    tablas={tablas}
                    graficas={graficas}
                    onChange={handleTablasChange}
                />

            </section>

            {/* Gráficas */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-5">

                <div>
                    <h2 className="text-base font-semibold text-black">Gráficas</h2>
                    <p className="text-sm text-gray-500 mt-1">Selecciona cómo quieres visualizar los datos.</p>
                </div>

                <GraficasEditor
                    graficas={graficas}
                    tablas={tablas}
                    tablasVistaPrevia={tablasVistaPrevia}
                    onChange={setGraficas}
                />

            </section>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.push('/admin/indicadores')}
                    disabled={loading}
                    className="text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
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
                        : esEdicion ? 'Guardar cambios' : 'Guardar indicador'
                    }
                </button>
            </div>

        </form>
    )

}