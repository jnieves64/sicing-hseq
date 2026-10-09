'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import DataGridEditor from './DataGridEditor'

import {
    filasATexto,
    prepararDatosParaGuardar,
    limpiarGraficas
} from '@/lib/indicadoresHelpers'

const COLUMNAS_INICIALES = [
    { key: 'col_1', label: 'Columna 1', formato: 'texto' },
    { key: 'col_2', label: 'Columna 2', formato: 'numero' },
    { key: 'col_3', label: 'Columna 3', formato: 'numero' }
]

function crearFilasIniciales(columnas) {
    return Array.from({ length: 5 }, () =>
        Object.fromEntries(columnas.map((columna) => [columna.key, '']))
    )
}

export default function IndicadorForm({ indicador, onSubmit }) {

    const router = useRouter()
    const esEdicion = Boolean(indicador)
    const tieneColumnas = Boolean(indicador?.columnas?.length)

    const [titulo, setTitulo] = useState(indicador?.titulo || '')
    const [descripcion, setDescripcion] = useState(indicador?.descripcion || '')
    const [activo, setActivo] = useState(indicador?.activo ?? true)

    const [columnas, setColumnas] = useState(
        tieneColumnas ? indicador.columnas : COLUMNAS_INICIALES
    )

    const [filas, setFilas] = useState(
        tieneColumnas && indicador.filas?.length
            ? filasATexto(indicador.columnas, indicador.filas)
            : crearFilasIniciales(tieneColumnas ? indicador.columnas : COLUMNAS_INICIALES)
    )

    // Por ahora las gráficas se conservan tal cual; el editor de gráficas llega en el siguiente paso.
    const [graficas] = useState(indicador?.graficas ?? [])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGridChange = ({ columnas, filas }) => {
        setColumnas(columnas)
        setFilas(filas)
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

        const datos = prepararDatosParaGuardar(columnas, filas)

        if (datos.error) {
            setError(datos.error)
            return
        }

        setLoading(true)

        const { error } = await onSubmit({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            columnas: datos.columnas,
            filas: datos.filas,
            graficas: limpiarGraficas(graficas, datos.columnas),
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
                    <p className="text-sm text-gray-500 mt-1">Carga y estructura la información que alimentará tus gráficas.</p>
                </div>

                <DataGridEditor
                    columnas={columnas}
                    filas={filas}
                    onChange={handleGridChange}
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