'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import IndicadorForm from '../../IndicadorForm'
import {
    getIndicadorAdminPorId,
    actualizarIndicador
} from '@/services/indicadoresAdminService'

export default function EditarIndicadorPage() {

    const { id } = useParams()

    const [indicador, setIndicador] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const { indicador, error } = await getIndicadorAdminPorId(id)

            if (error || !indicador) {
                setError('No se pudo cargar el indicador.')
                setLoading(false)
                return
            }

            setIndicador(indicador)
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
        <div className="p-8 space-y-6 max-w-5xl">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de indicadores', href: '/admin/indicadores' },
                    { label: 'Editar indicador' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Editar indicador</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Actualiza la información y los datos de "{indicador.titulo}".
                </p>
            </div>

            <IndicadorForm
                indicador={indicador}
                onSubmit={(datos) => actualizarIndicador(id, datos)}
            />

        </div>
    )

}