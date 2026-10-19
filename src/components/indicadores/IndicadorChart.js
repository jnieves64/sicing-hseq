'use client'

import {
    ResponsiveContainer,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

import {
    formatearValor,
    formatearTick,
    formatoDeCelda,
    esFilaSeccion
} from '@/lib/indicadoresHelpers'

const COLORES = ['#ebbb18', '#4b5563', '#9ca3af', '#b45309', '#d1d5db', '#fcd34d']

function aNumero(valor) {

    if (valor === null || valor === undefined || valor === '') return null

    const numero = Number(valor)

    return Number.isNaN(numero) ? null : numero

}

function Mensaje({ alto, texto }) {
    return (
        <div
            style={{ height: alto }}
            className="flex items-center justify-center text-xs text-gray-400 text-center px-4"
        >
            {texto}
        </div>
    )
}

/* ---------- Datos para líneas y barras ---------- */

function prepararSeries(config, tabla) {

    const columnas = tabla.columnas || []
    const filasDatos = (tabla.filas || []).filter((fila) => !esFilaSeccion(fila))
    const mapaColumnas = Object.fromEntries(columnas.map((c) => [c.key, c]))

    if (filasDatos.length === 0) return { mensaje: 'Aún no hay datos para graficar.' }

    // Orientación por FILAS: cada serie es una fila y las categorías
    // son los encabezados de las columnas elegidas.
    if (config.orientacion === 'filas') {

        const columnasElegidas = (config.columnas || []).map((key) => mapaColumnas[key]).filter(Boolean)
        const filasElegidas = (config.filas || [])
            .map((id) => filasDatos.find((fila) => fila._id === id))
            .filter(Boolean)
        const columnaEtiquetas = mapaColumnas[config.etiquetas]

        if (columnasElegidas.length === 0 || filasElegidas.length === 0) {
            return { mensaje: 'Selecciona las filas y columnas para ver la gráfica.' }
        }

        const series = filasElegidas.map((fila, i) => ({
            key: `s_${fila._id}`,
            nombre: (columnaEtiquetas && String(fila[columnaEtiquetas.key] ?? '').trim()) || `Fila ${i + 1}`
        }))

        const datos = columnasElegidas.map((columna) => {
            const punto = { categoria: columna.label, __formatos: {} }
            filasElegidas.forEach((fila) => {
                const key = `s_${fila._id}`
                punto[key] = aNumero(fila[columna.key])
                punto.__formatos[key] = formatoDeCelda(tabla, fila, columna)
            })
            return punto
        })

        return { datos, series }

    }

    // Orientación por COLUMNAS (la original): el eje X sale de una columna
    // y cada serie es una columna.
    const columnaX = mapaColumnas[config.x]
    const keys = (config.series || []).filter((key) => mapaColumnas[key])

    if (!columnaX || keys.length === 0) {
        return { mensaje: 'Selecciona las columnas para ver la gráfica.' }
    }

    const datos = filasDatos.map((fila) => {
        const punto = {
            categoria: formatearValor(fila[columnaX.key], formatoDeCelda(tabla, fila, columnaX)),
            __formatos: {}
        }
        keys.forEach((key) => {
            punto[key] = aNumero(fila[key])
            punto.__formatos[key] = formatoDeCelda(tabla, fila, mapaColumnas[key])
        })
        return punto
    })

    return {
        datos,
        series: keys.map((key) => ({ key, nombre: mapaColumnas[key].label }))
    }

}

/* ---------- Datos para la torta ---------- */

function prepararPorciones(config, tabla) {

    const columnas = tabla.columnas || []
    const filasDatos = (tabla.filas || []).filter((fila) => !esFilaSeccion(fila))
    const mapaColumnas = Object.fromEntries(columnas.map((c) => [c.key, c]))

    if (filasDatos.length === 0) return { mensaje: 'Aún no hay datos para graficar.' }

    let porciones

    if (config.orientacion === 'filas') {

        // Una fila elegida; cada porción es una de las columnas elegidas.
        const columnasElegidas = (config.columnas || []).map((key) => mapaColumnas[key]).filter(Boolean)
        const fila = (config.filas || [])
            .map((id) => filasDatos.find((f) => f._id === id))
            .find(Boolean)

        if (!fila || columnasElegidas.length === 0) {
            return { mensaje: 'Selecciona la fila y las columnas para ver la gráfica.' }
        }

        porciones = columnasElegidas.map((columna) => ({
            name: columna.label,
            value: aNumero(fila[columna.key]) ?? 0,
            formato: formatoDeCelda(tabla, fila, columna)
        }))

    } else {

        const porColumnas = config.modoTorta === 'columnas'
        const keys = (config.series || []).filter((key) => mapaColumnas[key])
        const columnaX = mapaColumnas[config.x]

        if (keys.length === 0 || (!porColumnas && !columnaX)) {
            return { mensaje: 'Selecciona las columnas para ver la gráfica.' }
        }

        porciones = porColumnas
            ? keys.map((key) => ({
                name: mapaColumnas[key].label,
                value: filasDatos.reduce((suma, fila) => suma + (aNumero(fila[key]) ?? 0), 0),
                formato: formatoDeCelda(tabla, filasDatos[0], mapaColumnas[key])
            }))
            : filasDatos.map((fila) => ({
                name: String(fila[columnaX.key] ?? ''),
                value: aNumero(fila[keys[0]]) ?? 0,
                formato: formatoDeCelda(tabla, fila, mapaColumnas[keys[0]])
            }))

    }

    // Una torta solo puede representar valores positivos
    const validas = porciones.filter((porcion) => porcion.value > 0)

    if (validas.length === 0) {
        return { mensaje: 'No hay valores positivos para graficar.' }
    }

    const total = validas.reduce((suma, porcion) => suma + porcion.value, 0)

    return {
        porciones: validas.map((porcion) => ({
            ...porcion,
            porcentaje: ((porcion.value / total) * 100).toFixed(1).replace('.', ',')
        }))
    }

}

/* ---------- Componente ---------- */

export default function IndicadorChart({ config, tablas = [], columnas, filas, alto = 280 }) {

    // Compatibilidad temporal con el editor actual, que trabaja con una sola tabla
    const tablasEfectivas = tablas.length > 0
        ? tablas
        : columnas
            ? [{ id: 't1', formatoPor: 'columna', columnas, filas: filas || [] }]
            : []

    const tabla = tablasEfectivas.find((t) => t.id === config?.tabla) ?? tablasEfectivas[0]

    if (!config || !tabla) {
        return <Mensaje alto={alto} texto="Aún no hay datos para graficar." />
    }

    /* ---------- TORTA ---------- */
    if (config.tipo === 'pie') {

        const { porciones, mensaje } = prepararPorciones(config, tabla)

        if (mensaje) return <Mensaje alto={alto} texto={mensaje} />

        return (
            <ResponsiveContainer width="100%" height={alto}>
                <PieChart>
                    <Pie
                        data={porciones}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius="70%"
                    >
                        {porciones.map((_, i) => (
                            <Cell key={i} fill={COLORES[i % COLORES.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name, item) => [
                            `${formatearValor(value, item?.payload?.formato)} (${item?.payload?.porcentaje}%)`,
                            name
                        ]}
                    />
                    <Legend
                        formatter={(value, entry) =>
                            entry?.payload?.porcentaje
                                ? `${value} · ${entry.payload.porcentaje}%`
                                : value
                        }
                    />
                </PieChart>
            </ResponsiveContainer>
        )

    }

    /* ---------- LÍNEAS Y BARRAS ---------- */
    const { datos, series, mensaje } = prepararSeries(config, tabla)

    if (mensaje) return <Mensaje alto={alto} texto={mensaje} />

    const valores = datos
        .flatMap((punto) => series.map((serie) => punto[serie.key]))
        .filter((valor) => typeof valor === 'number')

    const minimo = valores.length > 0 ? Math.min(...valores) : 0
    const maximo = valores.length > 0 ? Math.max(...valores) : 0

    // Si todo vale cero, el eje va de 0 a 1 (en vez de un eje vacío); si hay negativos, el eje los incluye.
    const dominio = minimo === 0 && maximo === 0 ? [0, 1] : [Math.min(0, minimo), 'auto']
    const soloEnteros = valores.every((valor) => Number.isInteger(valor))
    const formatoEjeY = datos[0]?.__formatos?.[series[0].key]

    const Contenedor = config.tipo === 'bar' ? BarChart : LineChart

    return (
        <ResponsiveContainer width="100%" height={alto}>
            <Contenedor data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

                <XAxis
                    dataKey="categoria"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                />

                <YAxis
                    domain={dominio}
                    allowDecimals={!soloEnteros}
                    tickFormatter={(valor) => formatearTick(valor, formatoEjeY)}
                    tick={{ fontSize: 11 }}
                    width={56}
                />

                <Tooltip
                    formatter={(value, name, item) => [
                        formatearValor(value, item?.payload?.__formatos?.[item?.dataKey]),
                        name
                    ]}
                />

                {series.length > 1 && <Legend />}

                {series.map((serie, i) =>
                    config.tipo === 'bar' ? (
                        <Bar
                            key={serie.key}
                            dataKey={serie.key}
                            name={serie.nombre}
                            fill={COLORES[i % COLORES.length]}
                            radius={[4, 4, 0, 0]}
                        />
                    ) : (
                        <Line
                            key={serie.key}
                            type="monotone"
                            dataKey={serie.key}
                            name={serie.nombre}
                            stroke={COLORES[i % COLORES.length]}
                            strokeWidth={2}
                            dot={false}
                        />
                    )
                )}

            </Contenedor>
        </ResponsiveContainer>
    )

}