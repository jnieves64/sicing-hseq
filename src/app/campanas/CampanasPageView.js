'use client'

import { useEffect, useState } from 'react'

import { getCampanas } from '@/services/campanasService'

import Header from '@/components/layout/Header'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import PageHeader from '@/components/shared/PageHeader'
import PublicacionCard from './PublicacionCard'

export default function CampanasPageView() {

    const [campanas, setCampanas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const { campanas, error } = await getCampanas()

            if (error) {
                setError('No se pudieron cargar las publicaciones.')
                setLoading(false)
                return
            }

            setCampanas(campanas)
            setLoading(false)

        }

        cargarDatos()

    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-sm text-gray-500">Cargando publicaciones...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-[1216px] mx-auto px-4 py-8 space-y-8">

                <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Campañas' }]} />

                <PageHeader
                    title="Campañas"
                    description="Comunicaciones y contenido de seguridad publicado por la empresa."
                />

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="max-w-3xl mx-auto space-y-6">

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-black">Publicaciones recientes</h2>
                        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                            Más recientes
                        </span>
                    </div>

                    {campanas.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">
                            Aún no hay publicaciones.
                        </p>
                    ) : (
                        campanas.map((campana) => (
                            <PublicacionCard key={campana.id} publicacion={campana} />
                        ))
                    )}

                </div>

            </main>
        </div>
    );

}