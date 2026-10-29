'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import EvaluacionForm from '../../EvaluacionForm'
import {
    getEvaluacionAdminPorId,
    actualizarEvaluacion
} from '@/services/evaluacionesAdminService'
import { getCategorias } from '@/services/documentosAdminService'

export default function EditarEvaluacionPage() {

    const { id } = useParams()

    const [evaluacion, setEvaluacion] = useState(null)
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const [
                { evaluacion: evaluacionData, error: evaluacionError },
                { categorias: categoriasData }
            ] = await Promise.all([
                getEvaluacionAdminPorId(id),
                getCategorias()
            ])

            if (evaluacionError || !evaluacionData) {
                setError('No se pudo cargar la evaluación.')
                setLoading(false)
                return
            }

            setEvaluacion(evaluacionData)
            setCategorias(categoriasData)
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
                    { label: 'Gestión de evaluaciones', href: '/admin/evaluaciones' },
                    { label: 'Editar evaluación' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Editar evaluación</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Actualiza la información de "{evaluacion.titulo}".
                </p>
            </div>

            <EvaluacionForm
                evaluacion={evaluacion}
                categorias={categorias}
                onSubmit={(datos) => actualizarEvaluacion(id, datos)}
            />

        </div>
    )

}