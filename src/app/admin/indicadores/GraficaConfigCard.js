'use client'

import { Fragment } from 'react'
import { Trash2 } from 'lucide-react'

import IndicadorChart from '@/components/indicadores/IndicadorChart'
import {
    agruparFilasPorSeccion,
    configuracionInicialGrafica,
    tituloDeTabla
} from '@/lib/indicadoresHelpers'

const TIPOS = [
    { valor: 'line', etiqueta: 'Líneas' },
    { valor: 'bar', etiqueta: 'Barras' },
    { valor: 'pie', etiqueta: 'Torta' }
]

const CLASE_SELECT = 'border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50'

const alternar = (lista, valor) =>
    lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]

// Nombre con el que se muestra una fila: el texto de la columna de nombres,
// o "Fila N" (el número que se ve en la cuadrícula) si está vacío.
function etiquetaDeFila(tabla, fila, claveEtiquetas) {
    const texto = claveEtiquetas ? String(fila[claveEtiquetas] ?? '').trim() : ''
    return texto || `Fila ${tabla.filas.indexOf(fila) + 1}`
}

export default function GraficaConfigCard({
    numero,
    grafica,
    tablas,
    tablasVistaPrevia,
    onChange,
    onEliminar
}) {

    const tabla = tablas.find((t) => t.id === grafica.tabla) ?? tablas[0]
    const columnas = tabla.columnas
    const columnasDatos = columnas.filter((columna) => columna.formato !== 'texto')
    const columnasTexto = columnas.filter((columna) => columna.formato === 'texto')
    const opcionesEtiquetas = columnasTexto.length > 0 ? columnasTexto : columnas

    const esTorta = grafica.tipo === 'pie'
    const porFilas = grafica.orientacion === 'filas'
    const modoTorta = grafica.modoTorta || 'filas'
    const tortaSumaDeColumnas = esTorta && !porFilas && modoTorta === 'columnas'
    const tortaDeUnaColumna = esTorta && !porFilas && modoTorta === 'filas'

    const filasElegidas = grafica.filas || []
    const columnasElegidas = grafica.columnas || []
    const grupos = agruparFilasPorSeccion(tabla)

    const base = { id: grafica.id, tipo: grafica.tipo, titulo: grafica.titulo }

    /* ---------- Cambios de estructura ---------- */

    const cambiarTabla = (idTabla) => {
        const nueva = tablas.find((t) => t.id === idTabla)
        onChange(configuracionInicialGrafica(nueva, { ...base, orientacion: grafica.orientacion || 'columnas' }))
    }

    const cambiarOrientacion = (orientacion) => {
        onChange(configuracionInicialGrafica(tabla, { ...base, orientacion }))
    }

    const cambiarTipo = (tipo) => {

        if (tipo === 'pie') {
            if (porFilas) {
                onChange({ ...grafica, tipo, filas: filasElegidas.slice(0, 1) })
            } else {
                onChange({ ...grafica, tipo, modoTorta: 'filas', series: (grafica.series || []).slice(0, 1) })
            }
            return
        }

        const { modoTorta: _omitido, ...resto } = grafica
        onChange({ ...resto, tipo })

    }

    const cambiarModoTorta = (modo) => {
        onChange({
            ...grafica,
            modoTorta: modo,
            series: modo === 'filas' ? (grafica.series || []).slice(0, 1) : (grafica.series || [])
        })
    }

    /* ---------- Opciones de la lista de filas (para la torta por filas) ---------- */

    const opcionesDeGrupo = (grupo) =>
        grupo.filas.map((fila) => (
            <option key={fila._id} value={fila._id}>
                {etiquetaDeFila(tabla, fila, grafica.etiquetas)}
            </option>
        ))

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
                                className={CLASE_SELECT}
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
                                placeholder="Ej. Accidentalidad 2021-2026"
                                className={CLASE_SELECT}
                            />
                        </div>

                    </div>

                    <div className={`grid grid-cols-1 gap-4 ${tablas.length > 1 ? 'sm:grid-cols-2' : ''}`}>

                        {tablas.length > 1 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Tabla de origen</label>
                                <select
                                    value={tabla.id}
                                    onChange={(event) => cambiarTabla(event.target.value)}
                                    className={CLASE_SELECT}
                                >
                                    {tablas.map((t, i) => (
                                        <option key={t.id} value={t.id}>
                                            {tituloDeTabla(t, i, tablas.length)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">¿Qué datos se grafican?</label>
                            <select
                                value={porFilas ? 'filas' : 'columnas'}
                                onChange={(event) => cambiarOrientacion(event.target.value)}
                                className={CLASE_SELECT}
                            >
                                <option value="columnas">Columnas (cada columna es una serie)</option>
                                <option value="filas">Filas (cada fila es una serie)</option>
                            </select>
                        </div>

                    </div>

                    {tabla.formatoPor === 'fila' && !porFilas && (
                        <p className="text-xs text-amber-700">
                            Esta tabla define el formato por fila; normalmente conviene graficar por filas.
                        </p>
                    )}

                    {/* ---------- Por FILAS ---------- */}
                    {porFilas && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Columna con los nombres de las filas
                                </label>
                                <select
                                    value={grafica.etiquetas ?? ''}
                                    onChange={(event) => onChange({ ...grafica, etiquetas: event.target.value })}
                                    className={CLASE_SELECT}
                                >
                                    <option value="">Selecciona una columna</option>
                                    {opcionesEtiquetas.map((columna) => (
                                        <option key={columna.key} value={columna.key}>{columna.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        {esTorta
                                            ? 'Columnas que forman las porciones'
                                            : 'Columnas del eje (sus encabezados son las categorías)'}
                                    </span>

                                    <span className="flex gap-3 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => onChange({ ...grafica, columnas: columnasDatos.map((c) => c.key) })}
                                            className="text-gray-500 hover:text-black underline"
                                        >
                                            Todas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onChange({ ...grafica, columnas: [] })}
                                            className="text-gray-500 hover:text-black underline"
                                        >
                                            Ninguna
                                        </button>
                                    </span>
                                </div>

                                {columnasDatos.length === 0 ? (
                                    <p className="text-xs text-gray-400">
                                        Esta tabla no tiene columnas de datos. Cambia el formato de alguna columna a algo distinto de Texto.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                                        {columnasDatos.map((columna) => (
                                            <label
                                                key={columna.key}
                                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={columnasElegidas.includes(columna.key)}
                                                    onChange={() =>
                                                        onChange({ ...grafica, columnas: alternar(columnasElegidas, columna.key) })
                                                    }
                                                    className="w-4 h-4 rounded accent-[#ebbb18]"
                                                />
                                                {columna.label}
                                            </label>
                                        ))}
                                    </div>
                                )}

                            </div>

                            {esTorta ? (

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Fila a graficar</label>
                                    <select
                                        value={filasElegidas[0] ?? ''}
                                        onChange={(event) =>
                                            onChange({ ...grafica, filas: event.target.value ? [event.target.value] : [] })
                                        }
                                        className={CLASE_SELECT}
                                    >
                                        <option value="">Selecciona una fila</option>
                                        {grupos.map((grupo, i) => (
                                            <Fragment key={i}>
                                                {grupo.titulo ? (
                                                    <optgroup label={grupo.titulo}>{opcionesDeGrupo(grupo)}</optgroup>
                                                ) : (
                                                    opcionesDeGrupo(grupo)
                                                )}
                                            </Fragment>
                                        ))}
                                    </select>
                                </div>

                            ) : (

                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-gray-700">Filas a graficar (series)</span>

                                    <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-3">
                                        {grupos.length === 0 && (
                                            <p className="text-xs text-gray-400">Esta tabla aún no tiene filas de datos.</p>
                                        )}

                                        {grupos.map((grupo, i) => (
                                            <div key={i} className="space-y-1.5">

                                                {grupo.titulo && (
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                                        {grupo.titulo}
                                                    </p>
                                                )}

                                                {grupo.filas.map((fila) => (
                                                    <label
                                                        key={fila._id}
                                                        className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filasElegidas.includes(fila._id)}
                                                            onChange={() =>
                                                                onChange({ ...grafica, filas: alternar(filasElegidas, fila._id) })
                                                            }
                                                            className="mt-0.5 w-4 h-4 rounded accent-[#ebbb18] shrink-0"
                                                        />
                                                        <span>{etiquetaDeFila(tabla, fila, grafica.etiquetas)}</span>
                                                    </label>
                                                ))}

                                            </div>
                                        ))}
                                    </div>
                                </div>

                            )}
                        </>
                    )}

                    {/* ---------- Por COLUMNAS ---------- */}
                    {!porFilas && (
                        <>
                            {esTorta && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Cada porción de la torta es</label>
                                    <select
                                        value={modoTorta}
                                        onChange={(event) => cambiarModoTorta(event.target.value)}
                                        className={CLASE_SELECT}
                                    >
                                        <option value="filas">Una fila (se reparte una columna de valores entre las filas)</option>
                                        <option value="columnas">Una columna (se compara el total de cada columna)</option>
                                    </select>
                                </div>
                            )}

                            {!tortaSumaDeColumnas && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {esTorta ? 'Columna con el nombre de cada porción' : 'Columna de categorías (eje X)'}
                                    </label>
                                    <select
                                        value={grafica.x ?? ''}
                                        onChange={(event) => onChange({ ...grafica, x: event.target.value })}
                                        className={CLASE_SELECT}
                                    >
                                        <option value="">Selecciona una columna</option>
                                        {columnas.map((columna) => (
                                            <option key={columna.key} value={columna.key}>{columna.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {tortaDeUnaColumna ? (

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Columna de valores</label>
                                    <select
                                        value={(grafica.series || [])[0] ?? ''}
                                        onChange={(event) =>
                                            onChange({ ...grafica, series: event.target.value ? [event.target.value] : [] })
                                        }
                                        className={CLASE_SELECT}
                                    >
                                        <option value="">Selecciona una columna</option>
                                        {columnasDatos.map((columna) => (
                                            <option key={columna.key} value={columna.key}>{columna.label}</option>
                                        ))}
                                    </select>
                                </div>

                            ) : (

                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {esTorta ? 'Columnas que forman la torta' : 'Columnas de valores (series)'}
                                    </span>

                                    {columnasDatos.length === 0 ? (
                                        <p className="text-xs text-gray-400">
                                            No hay columnas numéricas. Cambia el formato de alguna columna a Número, Moneda o Porcentaje.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                                            {columnasDatos.map((columna) => (
                                                <label
                                                    key={columna.key}
                                                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={(grafica.series || []).includes(columna.key)}
                                                        onChange={() =>
                                                            onChange({ ...grafica, series: alternar(grafica.series || [], columna.key) })
                                                        }
                                                        className="w-4 h-4 rounded accent-[#ebbb18]"
                                                    />
                                                    {columna.label}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            )}
                        </>
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
                            tablas={tablasVistaPrevia}
                            alto={220}
                        />
                    </div>
                </div>

            </div>

        </div>
    )

}