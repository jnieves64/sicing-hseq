'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

import {
    OPCIONES_FORMATO,
    parsearNumero,
    parsearPegado,
    parecenEncabezados,
    inferirFormato,
    normalizarTextoNumerico,
    generarKeyColumna
} from '@/lib/indicadoresHelpers'

function filaVacia(columnas) {
    return Object.fromEntries(columnas.map((columna) => [columna.key, '']))
}

export default function DataGridEditor({ columnas, filas, onChange }) {

    const [aviso, setAviso] = useState('')

    const actualizar = (nuevasColumnas, nuevasFilas) => {
        onChange({ columnas: nuevasColumnas, filas: nuevasFilas })
    }

    /* ---------- Edición básica ---------- */

    const cambiarCelda = (indiceFila, key, valor) => {
        actualizar(
            columnas,
            filas.map((fila, i) => (i === indiceFila ? { ...fila, [key]: valor } : fila))
        )
    }

    const cambiarColumna = (indiceColumna, cambios) => {
        actualizar(
            columnas.map((columna, i) => (i === indiceColumna ? { ...columna, ...cambios } : columna)),
            filas
        )
    }

    const agregarFila = () => {
        actualizar(columnas, [...filas, filaVacia(columnas)])
    }

    const agregarColumna = () => {
        const key = generarKeyColumna(columnas)
        const nuevaColumna = { key, label: `Columna ${columnas.length + 1}`, formato: 'numero' }
        actualizar(
            [...columnas, nuevaColumna],
            filas.map((fila) => ({ ...fila, [key]: '' }))
        )
    }

    const eliminarFila = (indiceFila) => {
        actualizar(columnas, filas.filter((_, i) => i !== indiceFila))
    }

    const eliminarColumna = (indiceColumna) => {
        const key = columnas[indiceColumna].key
        actualizar(
            columnas.filter((_, i) => i !== indiceColumna),
            filas.map((fila) => {
                const { [key]: _omitida, ...resto } = fila
                return resto
            })
        )
    }

    /* ---------- Teclado: Enter baja a la celda de abajo ---------- */

    const manejarTecla = (event, indiceFila, indiceColumna) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            document
                .querySelector(`[data-celda="${indiceFila + 1}-${indiceColumna}"]`)
                ?.focus()
        }
    }

    /* ---------- Pegado desde Excel ---------- */

    const manejarPegado = (event, indiceFila, indiceColumna) => {

        const textoPegado = event.clipboardData.getData('text')
        let matriz = parsearPegado(textoPegado)

        // Un solo valor: se deja el pegado normal dentro de la celda
        if (matriz.length <= 1 && (matriz[0]?.length ?? 0) <= 1) return

        event.preventDefault()

        // 1. ¿La primera fila son encabezados?
        let encabezados = null

        if (indiceFila === 0 && indiceColumna === 0 && matriz.length > 1 &&
            parecenEncabezados(matriz[0], matriz[1])) {
            encabezados = matriz[0]
            matriz = matriz.slice(1)
        }

        const ancho = Math.max(
            ...matriz.map((fila) => fila.length),
            encabezados ? encabezados.length : 0
        )

        // 2. Qué columnas estaban vacías o son nuevas (solo a esas se les detecta el formato)
        const columnasADetectar = []

        for (let c = 0; c < ancho; c++) {
            const indice = indiceColumna + c
            const estabaVacia =
                indice >= columnas.length ||
                filas.every((fila) => String(fila[columnas[indice].key] ?? '').trim() === '')
            if (estabaVacia) columnasADetectar.push(indice)
        }

        // 3. Crece la grilla si el pegado no cabe
        const nuevasColumnas = columnas.map((columna) => ({ ...columna }))
        let nuevasFilas = filas.map((fila) => ({ ...fila }))

        while (nuevasColumnas.length < indiceColumna + ancho) {
            const key = generarKeyColumna(nuevasColumnas)
            nuevasColumnas.push({ key, label: `Columna ${nuevasColumnas.length + 1}`, formato: 'texto' })
            nuevasFilas = nuevasFilas.map((fila) => ({ ...fila, [key]: '' }))
        }

        while (nuevasFilas.length < indiceFila + matriz.length) {
            nuevasFilas.push(filaVacia(nuevasColumnas))
        }

        // 4. Encabezados -> nombres de columna
        if (encabezados) {
            encabezados.forEach((texto, c) => {
                nuevasColumnas[indiceColumna + c].label = texto
            })
        }

        // 5. Escribe el bloque pegado
        matriz.forEach((filaPegada, r) => {
            for (let c = 0; c < ancho; c++) {
                const key = nuevasColumnas[indiceColumna + c].key
                nuevasFilas[indiceFila + r][key] = filaPegada[c] ?? ''
            }
        })

        // 6. Detecta el formato de las columnas vacías/nuevas
        columnasADetectar.forEach((indice) => {
            const key = nuevasColumnas[indice].key
            nuevasColumnas[indice].formato = inferirFormato(nuevasFilas.map((fila) => fila[key]))
        })

        // 7. En columnas numéricas, deja lo pegado en su forma canónica ("$18.500,00" -> "18500")
        matriz.forEach((_, r) => {
            for (let c = 0; c < ancho; c++) {
                const columna = nuevasColumnas[indiceColumna + c]
                if (columna.formato !== 'texto') {
                    const fila = nuevasFilas[indiceFila + r]
                    fila[columna.key] = normalizarTextoNumerico(fila[columna.key])
                }
            }
        })

        actualizar(nuevasColumnas, nuevasFilas)

        setAviso(
            `Se pegaron ${matriz.length} fila${matriz.length !== 1 ? 's' : ''} × ${ancho} columna${ancho !== 1 ? 's' : ''}` +
            (encabezados ? '. La primera fila se usó como encabezados.' : '.')
        )

    }

    /* ---------- Render ---------- */

    return (
        <div className="space-y-3">

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">

                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-10 px-2 py-2 text-xs font-medium text-gray-400 text-center border-b border-gray-200">
                                #
                            </th>

                            {columnas.map((columna, indiceColumna) => (
                                <th
                                    key={columna.key}
                                    className="min-w-[160px] px-2 py-2 border-b border-l border-gray-200 text-left align-top"
                                >
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={columna.label}
                                            onChange={(event) => cambiarColumna(indiceColumna, { label: event.target.value })}
                                            aria-label={`Nombre de la columna ${indiceColumna + 1}`}
                                            className="w-full bg-transparent text-xs font-semibold text-gray-800 outline-none focus:bg-white rounded px-1 py-1"
                                        />

                                        {columnas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => eliminarColumna(indiceColumna)}
                                                aria-label={`Eliminar la columna ${columna.label}`}
                                                className="shrink-0 p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <select
                                        value={columna.formato}
                                        onChange={(event) => cambiarColumna(indiceColumna, { formato: event.target.value })}
                                        aria-label={`Formato de la columna ${columna.label}`}
                                        className="mt-1 w-full text-xs border border-gray-200 rounded bg-white px-1 py-1 text-gray-600"
                                    >
                                        {OPCIONES_FORMATO.map((opcion) => (
                                            <option key={opcion.valor} value={opcion.valor}>
                                                {opcion.etiqueta}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                            ))}

                            <th className="w-10 border-b border-l border-gray-200" />
                        </tr>
                    </thead>

                    <tbody>
                        {filas.map((fila, indiceFila) => (
                            <tr key={indiceFila}>

                                <td className="px-2 py-1 text-xs text-gray-400 text-center bg-gray-50 border-t border-gray-100">
                                    {indiceFila + 1}
                                </td>

                                {columnas.map((columna, indiceColumna) => {

                                    const texto = fila[columna.key] ?? ''
                                    const invalida =
                                        columna.formato !== 'texto' &&
                                        texto.trim() !== '' &&
                                        parsearNumero(texto) === null

                                    return (
                                        <td
                                            key={columna.key}
                                            className="border-t border-l border-gray-100 p-0"
                                        >
                                            <input
                                                type="text"
                                                value={texto}
                                                data-celda={`${indiceFila}-${indiceColumna}`}
                                                onChange={(event) => cambiarCelda(indiceFila, columna.key, event.target.value)}
                                                onPaste={(event) => manejarPegado(event, indiceFila, indiceColumna)}
                                                onKeyDown={(event) => manejarTecla(event, indiceFila, indiceColumna)}
                                                aria-label={`${columna.label}, fila ${indiceFila + 1}`}
                                                title={invalida ? 'Esta celda debe contener un número' : undefined}
                                                className={`w-full px-3 py-2 text-sm outline-none ${
                                                    columna.formato === 'texto' ? 'text-left' : 'text-right'
                                                } ${
                                                    invalida
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-transparent focus:bg-[#ebbb18]/10'
                                                }`}
                                            />
                                        </td>
                                    )

                                })}

                                <td className="border-t border-l border-gray-100 text-center">
                                    <button
                                        type="button"
                                        onClick={() => eliminarFila(indiceFila)}
                                        disabled={filas.length <= 1}
                                        aria-label={`Eliminar la fila ${indiceFila + 1}`}
                                        className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={agregarFila}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} />
                    Agregar fila
                </button>

                <button
                    type="button"
                    onClick={agregarColumna}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} />
                    Agregar columna
                </button>
            </div>

            <p className="text-xs text-gray-500">
                Puedes copiar un rango desde Excel y pegarlo aquí (Ctrl+V) sobre cualquier celda.
                Si copias la tabla con sus encabezados y pegas en la primera celda, se detectan automáticamente.
            </p>

            {aviso && (
                <p className="text-xs text-green-700">{aviso}</p>
            )}

        </div>
    )

}