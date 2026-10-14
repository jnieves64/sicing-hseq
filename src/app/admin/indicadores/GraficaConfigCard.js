'use client'

import { Trash2 } from 'lucide-react'

import IndicadorChart from '@/components/indicadores/IndicadorChart'

const TIPOS = [
    { valor: 'line', etiqueta: 'Líneas' },
    { valor: 'bar', etiqueta: 'Barras' },
    { valor: 'pie', etiqueta: 'Torta' }
]

export default function GraficaConfigCard({
    numero,
    grafica,
    columnas,
    filasVistaPrevia,
    onChange,
    onEliminar
}) {

    const columnasNumericas = columnas.filter((columna) => columna.formato !== 'texto')

    const esTorta = grafica.tipo === 'pie'
    const modoTorta = grafica.modoTorta || 'filas'
    const tortaPorColumnas = esTorta && modoTorta === 'columnas'
    const tortaPorFilas = esTorta && modoTorta === 'filas'

    const cambiarTipo = (tipo) => {

        if (tipo === 'pie') {
            onChange({
                ...grafica,
                tipo,
                modoTorta: 'filas',
                series: grafica.series.slice(0, 1)
            })
            return
        }

        const { modoTorta: _omitido, ...resto } = grafica
        onChange({ ...resto, tipo })

    }

    const cambiarModoTorta = (modo) => {
        onChange({
            ...grafica,
            modoTorta: modo,
            series: modo === 'filas' ? grafica.series.slice(0, 1) : grafica.series
        })
    }

    const alternarSerie = (key) => {
        const series = grafica.series.includes(key)
            ? grafica.series.filter((serie) => serie !== key)
            : [...grafica.series, key]
        onChange({ ...grafica, series })
    }

    return (
        <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white">

            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black">Gráfica {numero}</h3>

                <button
                    type="button"
                    onClick={onEliminar}
                    aria-label={`Eliminar la gráfica ${numero}`}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

                {/* Configuración */}
                <div className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tipo de gráfica</label>
                            <select
                                value={grafica.tipo}
                                onChange={(event) => cambiarTipo(event.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                            >
                                {TIPOS.map((tipo) => (
                                    <option key={tipo.valor} value={tipo.valor}>{tipo.etiqueta}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text"
                                value={grafica.titulo}
                                onChange={(event) => onChange({ ...grafica, titulo: event.target.value })}
                                placeholder="Ej. Ingresos proyectados vs reales"
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                            />
                        </div>

                    </div>

                    {esTorta && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Cada porción de la torta es</label>
                            <select
                                value={modoTorta}
                                onChange={(event) => cambiarModoTorta(event.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                            >
                                <option value="filas">Una fila (se reparte una columna de valores entre las filas)</option>
                                <option value="columnas">Una columna (se compara el total de cada columna)</option>
                            </select>
                        </div>
                    )}

                    {!tortaPorColumnas && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                {esTorta ? 'Columna con el nombre de cada porción' : 'Columna de categorías (eje X)'}
                            </label>
                            <select
                                value={grafica.x}
                                onChange={(event) => onChange({ ...grafica, x: event.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                            >
                                <option value="">Selecciona una columna</option>
                                {columnas.map((columna) => (
                                    <option key={columna.key} value={columna.key}>{columna.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {tortaPorFilas ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Columna de valores</label>
                            <select
                                value={grafica.series[0] ?? ''}
                                onChange={(event) =>
                                    onChange({ ...grafica, series: event.target.value ? [event.target.value] : [] })
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
                            >
                                <option value="">Selecciona una columna</option>
                                {columnasNumericas.map((columna) => (
                                    <option key={columna.key} value={columna.key}>{columna.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                {esTorta ? 'Columnas que forman la torta' : 'Columnas de valores (series)'}
                            </span>

                            {columnasNumericas.length === 0 ? (
                                <p className="text-xs text-gray-400">
                                    No hay columnas numéricas. Cambia el formato de alguna columna a Número, Moneda o Porcentaje.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-x-5 gap-y-2">
                                    {columnasNumericas.map((columna) => (
                                        <label
                                            key={columna.key}
                                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={grafica.series.includes(columna.key)}
                                                onChange={() => alternarSerie(columna.key)}
                                                className="w-4 h-4 rounded accent-[#ebbb18]"
                                            />
                                            {columna.label}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Vista previa */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Vista previa</p>

                    <div className="border border-gray-100 rounded-lg bg-gray-50 p-3">
                        {grafica.titulo && (
                            <p className="text-xs font-semibold text-black mb-2">{grafica.titulo}</p>
                        )}

                        <IndicadorChart
                            config={grafica}
                            columnas={columnas}
                            filas={filasVistaPrevia}
                            alto={220}
                        />
                    </div>
                </div>

            </div>

        </div>
    )

}