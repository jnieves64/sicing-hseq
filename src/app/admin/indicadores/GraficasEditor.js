'use client'

import { Plus } from 'lucide-react'

import GraficaConfigCard from './GraficaConfigCard'
import { generarIdGrafica } from '@/lib/indicadoresHelpers'

export default function GraficasEditor({ graficas, columnas, filasVistaPrevia, onChange }) {

    const columnasNumericas = columnas.filter((columna) => columna.formato !== 'texto')

    const agregarGrafica = () => {

        const columnaX = columnas.find((columna) => columna.formato === 'texto') ?? columnas[0]

        onChange([
            ...graficas,
            {
                id: generarIdGrafica(graficas),
                tipo: 'line',
                titulo: '',
                x: columnaX?.key ?? '',
                series: columnasNumericas.length > 0 ? [columnasNumericas[0].key] : []
            }
        ])

    }

    const actualizarGrafica = (indice, grafica) => {
        onChange(graficas.map((actual, i) => (i === indice ? grafica : actual)))
    }

    const eliminarGrafica = (indice) => {
        onChange(graficas.filter((_, i) => i !== indice))
    }

    return (
        <div className="space-y-4">

            {graficas.length === 0 && (
                <p className="text-sm text-gray-400">
                    Aún no has agregado gráficas. Puedes guardar el indicador solo con la tabla de datos.
                </p>
            )}

            {graficas.map((grafica, indice) => (
                <GraficaConfigCard
                    key={grafica.id}
                    numero={indice + 1}
                    grafica={grafica}
                    columnas={columnas}
                    filasVistaPrevia={filasVistaPrevia}
                    onChange={(nueva) => actualizarGrafica(indice, nueva)}
                    onEliminar={() => eliminarGrafica(indice)}
                />
            ))}

            <button
                type="button"
                onClick={agregarGrafica}
                disabled={columnasNumericas.length === 0}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Plus size={14} />
                Agregar gráfica
            </button>

            {columnasNumericas.length === 0 && (
                <p className="text-xs text-gray-400">
                    Para crear gráficas necesitas al menos una columna numérica (Número, Moneda o Porcentaje).
                </p>
            )}

        </div>
    )

}