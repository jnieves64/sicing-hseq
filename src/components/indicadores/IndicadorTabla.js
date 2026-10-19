import { formatearValor, formatoDeCelda, esFilaSeccion } from '@/lib/indicadoresHelpers'

export default function IndicadorTabla({ tabla }) {

    const columnas = tabla?.columnas || []
    const filas = tabla?.filas || []

    if (columnas.length === 0 || filas.length === 0) {
        return (
            <p className="text-sm text-gray-400 py-8 text-center">
                Esta tabla aún no tiene datos.
            </p>
        )
    }

    // La cebra cuenta solo las filas de datos, para que las franjas de sección no la descuadren
    let contadorDatos = 0

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">

                <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                        {columnas.map((columna) => (
                            <th
                                key={columna.key}
                                className={`py-3 px-4 text-xs font-medium text-gray-600 ${
                                    columna.formato === 'texto'
                                        ? 'text-left min-w-[220px]'
                                        : 'text-right whitespace-nowrap'
                                }`}
                            >
                                {columna.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {filas.map((fila, indice) => {

                        if (esFilaSeccion(fila)) {
                            return (
                                <tr key={fila._id ?? `fila-${indice}`}>
                                    <td
                                        colSpan={columnas.length}
                                        className="py-2.5 px-4 text-sm font-semibold text-center text-black bg-[#ebbb18]/25 border-y border-gray-200"
                                    >
                                        {fila.texto}
                                    </td>
                                </tr>
                            )
                        }

                        const conCebra = contadorDatos % 2 === 1
                        contadorDatos += 1

                        return (
                            <tr
                                key={fila._id ?? `fila-${indice}`}
                                className={conCebra ? 'bg-gray-50/60' : ''}
                            >
                                {columnas.map((columna, posicion) => (
                                    <td
                                        key={columna.key}
                                        className={`py-2.5 px-4 ${
                                            columna.formato === 'texto'
                                                ? 'text-left whitespace-normal'
                                                : 'text-right text-gray-700 whitespace-nowrap'
                                        } ${posicion === 0 ? 'font-medium text-black' : ''}`}
                                    >
                                        {formatearValor(fila[columna.key], formatoDeCelda(tabla, fila, columna))}
                                    </td>
                                ))}
                            </tr>
                        )

                    })}
                </tbody>

            </table>
        </div>
    )

}