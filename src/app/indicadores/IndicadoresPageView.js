'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'
import IndicadorCard from './IndicadorCard'

import { getIndicadores } from '@/services/indicadoresService'

export default function IndicadoresPageView() {

    const [indicadores, setIndicadores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const { indicadores, error } = await getIndicadores()

            if (error) {
                setError('No se pudieron cargar los indicadores.')
                setLoading(false)
                return
            }

            setIndicadores(indicadores)
            setLoading(false)

        }

        cargarDatos()

    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-sm text-gray-500">Cargando indicadores...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-8">

                <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Indicadores' }]} />

                <PageHeader
                    title="Indicadores"
                    description="Consulta los indicadores de gestión publicados por la empresa."
                />

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {indicadores.length === 0 && !error ? (
                    <p className="text-sm text-gray-400 py-8 text-center">
                        Aún no hay indicadores publicados.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {indicadores.map((indicador) => (
                            <IndicadorCard key={indicador.id} indicador={indicador} />
                        ))}
                    </div>
                )}

            </main>
        </div>
    )

}