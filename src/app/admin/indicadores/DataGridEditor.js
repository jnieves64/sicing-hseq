'use client'

import { useState } from 'react'
import { Plus, Trash2, X, Heading } from 'lucide-react'

import {
    OPCIONES_FORMATO,
    parsearNumero,
    parsearPegado,
    parecenEncabezados,
    inferirFormato,
    normalizarTextoNumerico,
    generarIdUnico,
    formatoDeCelda,
    esFilaSeccion
} from '@/lib/indicadoresHelpers'

function crearFilaDatos(columnas, formatoPor) {
    return {
        _id: generarIdUnico('f'),
        ...(formatoPor === 'fila' ? { _formato: 'numero' } : {}),
        ...Object.fromEntries(columnas.map((columna) => [columna.key, '']))
    }
}

function plural(cantidad, singular, pluralTexto) {
    return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`
}

export default function DataGridEditor({ tabla, onChange }) {

    const { columnas, filas, formatoPor } = tabla
    const modoFila = formatoPor === 'fila'

    const [aviso, setAviso] = useState('')

    const actualizar = (cambios) => onChange({ ...tabla, ...cambios })

    /* ---------- Edición básica ---------- */

    const cambiarFila = (indiceFila, cambios) => {
        actualizar({
            filas: filas.map((fila, i) => (i === indiceFila ? { ...fila, ...cambios } : fila))
        })
    }

    const cambiarColumna = (indiceColumna, cambios) => {
        actualizar({
            columnas: columnas.map((columna, i) =>
                i === indiceColumna ? { ...columna, ...cambios } : columna
            )
        })
    }

    const agregarFila = () => {
        actualizar({ filas: [...filas, crearFilaDatos(columnas, formatoPor)] })
    }

    const agregarSeccion = () => {
        actualizar({
            filas: [...filas, { _id: generarIdUnico('f'), _tipo: 'seccion', texto: '' }]
        })
    }

    const agregarColumna = () => {
        const key = generarIdUnico('col')
        actualizar({
            columnas: [...columnas, { key, label: `Columna ${columnas.length + 1}`, formato: 'numero' }],
            filas: filas.map((fila) => (esFilaSeccion(fila) ? fila : { ...fila, [key]: '' }))
        })
    }

    const eliminarFila = (indiceFila) => {
        actualizar({ filas: filas.filter((_, i) => i !== indiceFila) })
    }

    const eliminarColumna = (indiceColumna) => {
        const key = columnas[indiceColumna].key
        actualizar({
            columnas: columnas.filter((_, i) => i !== indiceColumna),
            filas: filas.map((fila) => {
                if (esFilaSeccion(fila)) return fila
                const { [key]: _omitida, ...resto } = fila
                return resto
            })
        })
    }

    // Convierte una fila de datos en franja de sección (o al revés)
    const alternarSeccion = (indiceFila) => {

        const fila = filas[indiceFila]
        let nueva

        if (esFilaSeccion(fila)) {
            nueva = { ...crearFilaDatos(columnas, formatoPor), _id: fila._id }
            if (columnas[0]) nueva[columnas[0].key] = fila.texto ?? ''
        } else {
            const primeraCelda = columnas
                .map((columna) => String(fila[columna.key] ?? '').trim())
                .find((texto) => texto !== '') ?? ''
            nueva = { _id: fila._id, _tipo: 'seccion', texto: primeraCelda }
        }

        actualizar({ filas: filas.map((actual, i) => (i === indiceFila ? nueva : actual)) })

    }

    /* ---------- Teclado: Enter baja a la celda de abajo ---------- */

    const enfocarSiguiente = (indiceFila, indiceColumna) => {
        for (let i = indiceFila + 1; i < filas.length; i++) {
            const destino = document.querySelector(
                `[data-tabla="${tabla.id}"] [data-celda="${i}-${indiceColumna}"]`
            )
            if (destino) {
                destino.focus()
                return
            }
        }
    }

    const manejarTecla = (event, indiceFila, indiceColumna) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            enfocarSiguiente(indiceFila, indiceColumna)
        }
    }

    /* ---------- Pegado desde Excel ---------- */

    const manejarPegado = (event, indiceFila, indiceColumna) => {

        let matriz = parsearPegado(event.clipboardData.getData('text'))

        // Un solo valor: se deja el pegado normal dentro de la celda
        if (matriz.length <= 1 && (matriz[0]?.length ?? 0) <= 1) return

        event.preventDefault()

        // 1. ¿La primera fila son encabezados?
        let encabezados = null

        if (indiceFila === 0 && indiceColumna === 0 && matriz.length > 1) {
            const primeraConDatos = matriz
                .slice(1)
                .find((fila) => fila.some((celda) => parsearNumero(celda) !== null))

            if (parecenEncabezados(matriz[0], primeraConDatos ?? [])) {
                encabezados = matriz[0]
                matriz = matriz.slice(1)
            }
        }

        // 2. Franjas de sección: una fila con solo la primera celda llena
        //    (así llegan las celdas combinadas de Excel)
        const anchoTotal = Math.max(
            ...matriz.map((fila) => fila.length),
            encabezados ? encabezados.length : 0,
            0
        )

        const esSeccionPegada = (fila) =>
            indiceColumna === 0 &&
            anchoTotal >= 2 &&
            (fila[0] ?? '') !== '' &&
            fila.slice(1).every((celda) => celda === '')

        const ancho = Math.max(
            ...matriz.filter((fila) => !esSeccionPegada(fila)).map((fila) => fila.length),
            encabezados ? encabezados.length : 0,
            0
        )

        // 3. Columnas vacías o nuevas: solo a esas se les detecta el formato
        const columnasADetectar = []

        for (let c = 0; c < ancho; c++) {
            const indice = indiceColumna + c
            const estabaVacia =
                indice >= columnas.length ||
                filas.every(
                    (fila) => esFilaSeccion(fila) || String(fila[columnas[indice].key] ?? '').trim() === ''
                )
            if (estabaVacia) columnasADetectar.push(indice)
        }

        // 4. Crece la grilla si el pegado no cabe
        const nuevasColumnas = columnas.map((columna) => ({ ...columna }))
        let nuevasFilas = filas.map((fila) => ({ ...fila }))

        while (nuevasColumnas.length < indiceColumna + ancho) {
            const key = generarIdUnico('col')
            const posicionNueva = nuevasColumnas.length
            nuevasColumnas.push({
                key,
                label: `Columna ${posicionNueva + 1}`,
                formato: modoFila ? (posicionNueva === 0 ? 'texto' : 'numero') : 'texto'
            })
            nuevasFilas = nuevasFilas.map((fila) => (esFilaSeccion(fila) ? fila : { ...fila, [key]: '' }))
        }

        while (nuevasFilas.length < indiceFila + matriz.length) {
            nuevasFilas.push(crearFilaDatos(nuevasColumnas, formatoPor))
        }

        // 5. Encabezados -> nombres de columna
        if (encabezados) {
            encabezados.forEach((texto, c) => {
                nuevasColumnas[indiceColumna + c].label = texto
            })
        }

        // 6. Escribe el bloque pegado
        const posicionesDatos = []

        matriz.forEach((filaPegada, r) => {

            const posicion = indiceFila + r
            const actual = nuevasFilas[posicion]

            if (esSeccionPegada(filaPegada)) {
                nuevasFilas[posicion] = { _id: actual._id, _tipo: 'seccion', texto: filaPegada[0] }
                return
            }

            // Si ahí había una franja de sección, vuelve a ser fila de datos
            const fila = esFilaSeccion(actual)
                ? { ...crearFilaDatos(nuevasColumnas, formatoPor), _id: actual._id }
                : actual

            for (let c = 0; c < ancho; c++) {
                fila[nuevasColumnas[indiceColumna + c].key] = filaPegada[c] ?? ''
            }

            nuevasFilas[posicion] = fila
            posicionesDatos.push(posicion)

        })

        // 7. Detecta formatos
        if (modoFila) {

            // Cada fila pegada toma el formato que sugieren sus datos
            posicionesDatos.forEach((posicion) => {

                const fila = nuevasFilas[posicion]
                const valores = []

                for (let c = 0; c < ancho; c++) {
                    const columna = nuevasColumnas[indiceColumna + c]
                    const texto = String(fila[columna.key] ?? '').trim()
                    if (columna.formato !== 'texto' && texto !== '') valores.push(texto)
                }

                fila._formato = valores.length > 0 ? inferirFormato(valores) : (fila._formato || 'numero')

            })

        } else {

            columnasADetectar.forEach((indice) => {
                const key = nuevasColumnas[indice].key
                const textos = nuevasFilas
                    .filter((fila) => !esFilaSeccion(fila))
                    .map((fila) => fila[key])
                nuevasColumnas[indice].formato = inferirFormato(textos)
            })

        }

        // 8. En celdas numéricas deja lo pegado en su forma canónica ("$18.500,00" -> "18500")
        posicionesDatos.forEach((posicion) => {

            const fila = nuevasFilas[posicion]

            for (let c = 0; c < ancho; c++) {
                const columna = nuevasColumnas[indiceColumna + c]
                if (formatoDeCelda({ formatoPor }, fila, columna) !== 'texto') {
                    fila[columna.key] = normalizarTextoNumerico(fila[columna.key])
                }
            }

        })

        actualizar({ columnas: nuevasColumnas, filas: nuevasFilas })

        const franjas = matriz.length - posicionesDatos.length

        setAviso(
            `Se pegaron ${plural(posicionesDatos.length, 'fila', 'filas')} × ${plural(ancho, 'columna', 'columnas')}` +
            (franjas > 0 ? ` y ${plural(franjas, 'franja de sección', 'franjas de sección')}` : '') +
            (encabezados ? '. La primera fila se usó como encabezados.' : '.')
        )

    }

    /* ---------- Render ---------- */

    return (
        <div className="space-y-3" data-tabla={tabla.id}>

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">

                    <thead className="bg-gray-50">
                        <tr>

                            <th className="w-10 px-2 py-2 text-xs font-medium text-gray-400 text-center border-b border-gray-200">
                                #
                            </th>

                            {modoFila && (
                                <th className="w-[140px] px-2 py-2 text-xs font-medium text-gray-500 text-left align-top border-b border-l border-gray-200">
                                    Formato de la fila
                                </th>
                            )}

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
                                        value={modoFila ? (columna.formato === 'texto' ? 'texto' : 'numero') : columna.formato}
                                        onChange={(event) => cambiarColumna(indiceColumna, { formato: event.target.value })}
                                        aria-label={`Formato de la columna ${columna.label}`}
                                        className="mt-1 w-full text-xs border border-gray-200 rounded bg-white px-1 py-1 text-gray-600"
                                    >
                                        {modoFila ? (
                                            <>
                                                <option value="texto">Texto (nombres)</option>
                                                <option value="numero">Datos</option>
                                            </>
                                        ) : (
                                            OPCIONES_FORMATO.map((opcion) => (
                                                <option key={opcion.valor} value={opcion.valor}>
                                                    {opcion.etiqueta}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </th>
                            ))}

                            <th className="w-[76px] border-b border-l border-gray-200" />

                        </tr>
                    </thead>

                    <tbody>
                        {filas.map((fila, indiceFila) => {

                            const seccion = esFilaSeccion(fila)

                            return (
                                <tr key={fila._id ?? indiceFila}>

                                    <td className="px-2 py-1 text-xs text-gray-400 text-center bg-gray-50 border-t border-gray-100">
                                        {indiceFila + 1}
                                    </td>

                                    {modoFila && (
                                        seccion ? (
                                            <td className="border-t border-l border-gray-100 bg-[#ebbb18]/20" />
                                        ) : (
                                            <td className="border-t border-l border-gray-100 p-1">
                                                <select
                                                    value={fila._formato || 'numero'}
                                                    onChange={(event) => cambiarFila(indiceFila, { _formato: event.target.value })}
                                                    aria-label={`Formato de la fila ${indiceFila + 1}`}
                                                    className="w-full text-xs border border-gray-200 rounded bg-white px-1 py-1 text-gray-600"
                                                >
                                                    {OPCIONES_FORMATO.map((opcion) => (
                                                        <option key={opcion.valor} value={opcion.valor}>
                                                            {opcion.etiqueta}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        )
                                    )}

                                    {seccion ? (

                                        <td
                                            colSpan={columnas.length}
                                            className="border-t border-l border-gray-100 p-0 bg-[#ebbb18]/20"
                                        >
                                            <input
                                                type="text"
                                                value={fila.texto ?? ''}
                                                data-celda={`${indiceFila}-0`}
                                                onChange={(event) => cambiarFila(indiceFila, { texto: event.target.value })}
                                                onKeyDown={(event) => manejarTecla(event, indiceFila, 0)}
                                                placeholder="Texto de la franja de sección"
                                                aria-label={`Franja de sección, fila ${indiceFila + 1}`}
                                                className="w-full px-3 py-2 text-sm font-semibold text-center bg-transparent outline-none focus:bg-white/60"
                                            />
                                        </td>

                                    ) : (

                                        columnas.map((columna, indiceColumna) => {

                                            const texto = fila[columna.key] ?? ''
                                            const formatoCelda = formatoDeCelda(tabla, fila, columna)
                                            const invalida =
                                                formatoCelda !== 'texto' &&
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
                                                        onChange={(event) => cambiarFila(indiceFila, { [columna.key]: event.target.value })}
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

                                        })

                                    )}

                                    <td className="border-t border-l border-gray-100 text-center whitespace-nowrap">

                                        <button
                                            type="button"
                                            onClick={() => alternarSeccion(indiceFila)}
                                            aria-label={seccion ? `Convertir la fila ${indiceFila + 1} en fila de datos` : `Convertir la fila ${indiceFila + 1} en franja de sección`}
                                            title={seccion ? 'Convertir en fila de datos' : 'Convertir en franja de sección'}
                                            className={`p-1.5 rounded ${seccion ? 'text-[#b45309] bg-[#ebbb18]/30' : 'text-gray-400 hover:text-gray-700'}`}
                                        >
                                            <Heading size={14} />
                                        </button>

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
                            )

                        })}
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
                    onClick={agregarSeccion}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    <Plus size={14} />
                    Agregar franja de sección
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
                Puedes copiar un rango desde Excel y pegarlo aquí (Ctrl+V) sobre cualquier celda. Si copias la tabla
                con sus encabezados y pegas en la primera celda, se detectan automáticamente, igual que las franjas
                de sección (filas con una sola celda llena).
            </p>

            {aviso && (
                <p className="text-xs text-green-700">{aviso}</p>
            )}

        </div>
    )

}