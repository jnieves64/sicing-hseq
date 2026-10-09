import { formatearValor } from '@/lib/indicadoresHelpers'

export default function IndicadorTabla({ columnas = [], filas = [] }) {

    if (columnas.length === 0 || filas.length === 0) {
        return (
            <p className="text-sm text-gray-400 py-8 text-center">
                Este indicador aún no tiene datos.
            </p>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">

                <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                        {columnas.map((columna) => (
                            <th
                                key={columna.key}
                                className={`py-3 px-4 text-xs font-medium text-gray-600 whitespace-nowrap ${
                                    columna.formato === 'texto' ? 'text-left' : 'text-right'
                                }`}
                            >
                                {columna.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {filas.map((fila, indice) => (
                        <tr key={indice} className={indice % 2 === 1 ? 'bg-gray-50/60' : ''}>
                            {columnas.map((columna, posicion) => (
                                <td
                                    key={columna.key}
                                    className={`py-2.5 px-4 whitespace-nowrap ${
                                        columna.formato === 'texto' ? 'text-left' : 'text-right text-gray-700'
                                    } ${posicion === 0 ? 'font-medium text-black' : ''}`}
                                >
                                    {formatearValor(fila[columna.key], columna.formato)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )

}