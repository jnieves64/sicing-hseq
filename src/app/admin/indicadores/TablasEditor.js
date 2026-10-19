'use client'

import { Plus, Trash2 } from 'lucide-react'

import DataGridEditor from './DataGridEditor'
import { cambiarFormatoPorTabla, crearTablaVacia } from '@/lib/indicadoresHelpers'

export default function TablasEditor({ tablas, graficas, onChange }) {

    const actualizarTabla = (indice, tabla) => {
        onChange(tablas.map((actual, i) => (i === indice ? tabla : actual)))
    }

    const agregarTabla = () => {
        onChange([...tablas, crearTablaVacia()])
    }

    const eliminarTabla = (indice) => {

        const tabla = tablas[indice]

        const graficasDeLaTabla = graficas.filter(
            (grafica) => (grafica.tabla ?? tablas[0].id) === tabla.id
        ).length

        if (graficasDeLaTabla > 0) {
            const confirmado = window.confirm(
                `Esta tabla alimenta ${graficasDeLaTabla} gráfica${graficasDeLaTabla !== 1 ? 's' : ''}, ` +
                `que se eliminarán junto con ella. ¿Continuar?`
            )
            if (!confirmado) return
        }

        onChange(tablas.filter((_, i) => i !== indice))

    }

    return (
        <div className="space-y-6">

            {tablas.map((tabla, indice) => (
                <div key={tabla.id} className="border border-gray-200 rounded-xl p-5 space-y-4">

                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-black">Tabla {indice + 1}</h3>

                        {tablas.length > 1 && (
                            <button
                                type="button"
                                onClick={() => eliminarTabla(indice)}
                                aria-label={`Eliminar la tabla ${indice + 1}`}
                                className="p-1.5 text-gray-400 hover:text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Título de la tabla (opcional)</label>
                            <input
                                type="text"
                                value={tabla.titulo}
                                onChange={(event) => actualizarTabla(indice, { ...tabla, titulo: event.target.value })}
                                placeholder="Ej. Información 2021-2026"
                                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">El formato se define</label>
                            <select
                                value={tabla.formatoPor}
                                onChange={(event) => actualizarTabla(indice, cambiarFormatoPorTabla(tabla, event.target.value))}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50"
                            >
                                <option value="columna">Por columna</option>
                                <option value="fila">Por fila</option>
                            </select>
                        </div>

                    </div>

                    <p className="text-xs text-gray-500">
                        {tabla.formatoPor === 'fila'
                            ? 'Cada fila tiene su propio formato (conteos, porcentajes, texto...). Úsalo cuando los meses o años son columnas y cada fila mide algo distinto.'
                            : 'Cada columna tiene su formato. Es lo habitual cuando cada columna es una medida (ingresos, gastos...).'}
                    </p>

                    <DataGridEditor
                        tabla={tabla}
                        onChange={(tablaActualizada) => actualizarTabla(indice, tablaActualizada)}
                    />

                </div>
            ))}

            <button
                type="button"
                onClick={agregarTabla}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
                <Plus size={14} />
                Agregar tabla
            </button>

        </div>
    )

}