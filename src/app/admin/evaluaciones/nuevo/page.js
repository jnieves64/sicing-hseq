'use client'

import { useEffect, useState } from 'react'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import EvaluacionForm from '../EvaluacionForm'
import { crearEvaluacion } from '@/services/evaluacionesAdminService'
import { getCategorias } from '@/services/documentosAdminService'

export default function NuevaEvaluacionPage() {

    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const cargarCategorias = async () => {
            const { categorias } = await getCategorias()
            setCategorias(categorias)
            setLoading(false)
        }

        cargarCategorias()

    }, [])

    if (loading) {
        return <p className="p-8 text-sm text-gray-500">Cargando...</p>
    }

    return (
        <div className="p-8 space-y-6 max-w-3xl">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de evaluaciones', href: '/admin/evaluaciones' },
                    { label: 'Nueva evaluación' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Nueva evaluación</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Crea una evaluación de conocimiento con preguntas de opción y de verdadero o falso.
                </p>
            </div>

            <EvaluacionForm
                categorias={categorias}
                onSubmit={crearEvaluacion}
            />

        </div>
    )

}