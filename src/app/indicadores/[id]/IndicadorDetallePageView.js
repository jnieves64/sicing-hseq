'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'
import IndicadorChart from '@/components/indicadores/IndicadorChart'
import IndicadorTabla from '@/components/indicadores/IndicadorTabla'

import { getIndicadorPorId } from '@/services/indicadoresService'
import { formatearFecha } from '@/lib/indicadoresHelpers'

export default function IndicadorDetallePageView() {

    const { id } = useParams()

    const [indicador, setIndicador] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const { indicador, error } = await getIndicadorPorId(id)

            if (error || !indicador) {
                setError('No se encontró el indicador.')
                setLoading(false)
                return
            }

            setIndicador(indicador)
            setLoading(false)

        }

        cargarDatos()

    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-sm text-gray-500">Cargando indicador...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-6">
                    <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Indicadores', href: '/indicadores' }]} />
                    <p className="text-sm text-red-600">{error}</p>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-8">

                <Breadcrumbs
                    items={[
                        { label: 'Inicio', href: '/' },
                        { label: 'Indicadores', href: '/indicadores' },
                        { label: indicador.titulo }
                    ]}
                />

                <div className="space-y-2">
                    <PageHeader title={indicador.titulo} description={indicador.descripcion} />
                    <p className="text-xs text-gray-400">
                        Actualizado el {formatearFecha(indicador.updated_at)}
                    </p>
                </div>

                {indicador.graficas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {indicador.graficas.map((grafica) => (
                            <div
                                key={grafica.id}
                                className="bg-white rounded-xl border border-gray-200 p-5"
                            >
                                <h2 className="text-sm font-semibold text-black mb-4">
                                    {grafica.titulo}
                                </h2>
                                <IndicadorChart
                                    config={grafica}
                                    columnas={indicador.columnas}
                                    filas={indicador.filas}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                        <h2 className="text-base font-semibold text-black">Datos completos</h2>
                    </div>
                    <IndicadorTabla columnas={indicador.columnas} filas={indicador.filas} />
                </div>

            </main>
        </div>
    )

}