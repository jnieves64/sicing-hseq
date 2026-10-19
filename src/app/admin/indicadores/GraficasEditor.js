'use client'

import { Plus } from 'lucide-react'

import GraficaConfigCard from './GraficaConfigCard'
import { generarIdGrafica, configuracionInicialGrafica } from '@/lib/indicadoresHelpers'

export default function GraficasEditor({ graficas, tablas, tablasVistaPrevia, onChange }) {

    const tieneColumnasDeDatos = (tabla) => tabla.columnas.some((columna) => columna.formato !== 'texto')
    const hayColumnasDeDatos = tablas.some(tieneColumnasDeDatos)

    const agregarGrafica = () => {

        // Se parte de la primera tabla que tenga columnas de datos
        const tabla = tablas.find(tieneColumnasDeDatos) ?? tablas[0]

        onChange([
            ...graficas,
            configuracionInicialGrafica(tabla, {
                id: generarIdGrafica(graficas),
                tipo: 'line',
                titulo: '',
                orientacion: tabla.formatoPor === 'fila' ? 'filas' : 'columnas'
            })
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
                    Aún no has agregado gráficas. Puedes guardar el indicador solo con las tablas de datos.
                </p>
            )}

            {graficas.map((grafica, indice) => (
                <GraficaConfigCard
                    key={grafica.id}
                    numero={indice + 1}
                    grafica={grafica}
                    tablas={tablas}
                    tablasVistaPrevia={tablasVistaPrevia}
                    onChange={(nueva) => actualizarGrafica(indice, nueva)}
                    onEliminar={() => eliminarGrafica(indice)}
                />
            ))}

            <button
                type="button"
                onClick={agregarGrafica}
                disabled={!hayColumnasDeDatos}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Plus size={14} />
                Agregar gráfica
            </button>

            {!hayColumnasDeDatos && (
                <p className="text-xs text-gray-400">
                    Para crear gráficas necesitas al menos una columna de datos (Número, Moneda, Porcentaje o Datos).
                </p>
            )}

        </div>
    )

}