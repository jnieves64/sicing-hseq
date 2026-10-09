'use client'

import {
    ResponsiveContainer,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

import { formatearValor, formatearTick } from '@/lib/indicadoresHelpers'

const COLORES = ['#ebbb18', '#4b5563', '#9ca3af', '#b45309', '#d1d5db', '#fcd34d']

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

export default function IndicadorChart({ config, columnas = [], filas = [], alto = 280 }) {

    const mapaColumnas = Object.fromEntries(columnas.map((c) => [c.key, c]))
    const columnaX = mapaColumnas[config?.x]
    const series = (config?.series || []).filter((key) => mapaColumnas[key])

    if (!config || filas.length === 0) {
        return <Mensaje alto={alto} texto="Aún no hay datos para graficar." />
    }

    /* ---------- TORTA ---------- */
    if (config.tipo === 'pie') {

        const porColumnas = config.modoTorta === 'columnas'

        if (series.length === 0 || (!porColumnas && !columnaX)) {
            return <Mensaje alto={alto} texto="Selecciona las columnas para ver la gráfica." />
        }

        const datos = porColumnas
            ? series.map((key) => ({
                name: mapaColumnas[key].label,
                value: filas.reduce((suma, fila) => suma + (Number(fila[key]) || 0), 0),
                formato: mapaColumnas[key].formato
            }))
            : filas.map((fila) => ({
                name: String(fila[config.x] ?? ''),
                value: Number(fila[series[0]]) || 0,
                formato: mapaColumnas[series[0]].formato
            }))

        // Una torta solo puede representar valores positivos
        const datosValidos = datos.filter((d) => d.value > 0)

        if (datosValidos.length === 0) {
            return <Mensaje alto={alto} texto="No hay valores positivos para graficar." />
        }

        const total = datosValidos.reduce((suma, d) => suma + d.value, 0)

        const datosConPorcentaje = datosValidos.map((d) => ({
            ...d,
            porcentaje: ((d.value / total) * 100).toFixed(1).replace('.', ',')
        }))

        return (
            <ResponsiveContainer width="100%" height={alto}>
                <PieChart>
                    <Pie
                        data={datosConPorcentaje}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius="70%"
                    >
                        {datosConPorcentaje.map((_, i) => (
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
    if (!columnaX || series.length === 0) {
        return <Mensaje alto={alto} texto="Selecciona las columnas para ver la gráfica." />
    }

    const Contenedor = config.tipo === 'bar' ? BarChart : LineChart

    return (
        <ResponsiveContainer width="100%" height={alto}>
            <Contenedor data={filas} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

                <XAxis
                    dataKey={config.x}
                    tickFormatter={(valor) => formatearValor(valor, columnaX.formato)}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                />

                <YAxis
                    tickFormatter={(valor) => formatearTick(valor, mapaColumnas[series[0]].formato)}
                    tick={{ fontSize: 11 }}
                    width={56}
                />

                <Tooltip
                    formatter={(value, name, item) => [
                        formatearValor(value, mapaColumnas[item?.dataKey]?.formato),
                        name
                    ]}
                />

                {series.length > 1 && <Legend />}

                {series.map((key, i) =>
                    config.tipo === 'bar' ? (
                        <Bar
                            key={key}
                            dataKey={key}
                            name={mapaColumnas[key].label}
                            fill={COLORES[i % COLORES.length]}
                            radius={[4, 4, 0, 0]}
                        />
                    ) : (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            name={mapaColumnas[key].label}
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