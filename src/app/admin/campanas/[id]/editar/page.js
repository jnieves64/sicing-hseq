'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import CampanaForm from '../../CampanaForm'
import { getCampanaPorId, actualizarCampana } from '@/services/campanasAdminService'

export default function EditarCampanaPage() {

    const { id } = useParams()

    const [campana, setCampana] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const { campana, error } = await getCampanaPorId(id)

            if (error || !campana) {
                setError('No se pudo cargar la publicación.')
                setLoading(false)
                return
            }

            setCampana(campana)
            setLoading(false)

        }

        cargarDatos()

    }, [id])

    if (loading) {
        return <p className="p-8 text-sm text-gray-500">Cargando...</p>
    }

    if (error) {
        return <p className="p-8 text-sm text-red-600">{error}</p>
    }

    return (
        <div className="p-8 space-y-6 max-w-3xl">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de campañas', href: '/admin/campanas' },
                    { label: 'Editar publicación' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Editar publicación</h1>
                <p className="text-sm text-gray-500 mt-1">Actualiza el contenido de esta publicación.</p>
            </div>

            <CampanaForm
                campana={campana}
                onSubmit={(datos) => actualizarCampana(id, datos)}
            />

        </div>
    )

}