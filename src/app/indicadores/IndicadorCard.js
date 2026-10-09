import Link from 'next/link'
import { BarChart3, ArrowUpRight } from 'lucide-react'

import { formatearFecha, etiquetasDeGraficas } from '@/lib/indicadoresHelpers'

export default function IndicadorCard({ indicador }) {

    const etiquetas = etiquetasDeGraficas(indicador.graficas)

    return (
        <Link
            href={`/indicadores/${indicador.id}`}
            className="group flex flex-col bg-white rounded-xl border border-gray-200 p-6 hover:border-[#ebbb18] transition-colors"
        >

            <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-full bg-[#ebbb18]/20 flex items-center justify-center">
                    <BarChart3 size={20} className="text-[#b45309]" />
                </div>

                <ArrowUpRight
                    size={18}
                    className="text-gray-300 group-hover:text-black transition-colors"
                />
            </div>

            <h2 className="mt-5 text-base font-semibold text-black">
                {indicador.titulo}
            </h2>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {indicador.descripcion}
            </p>

            <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-2">

                <span className="text-xs text-gray-400">
                    Actualizado el {formatearFecha(indicador.updated_at)}
                </span>

                <div className="flex flex-wrap gap-1.5">
                    {etiquetas.map((etiqueta) => (
                        <span
                            key={etiqueta}
                            className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                        >
                            {etiqueta}
                        </span>
                    ))}
                </div>

            </div>

        </Link>
    )

}