'use client'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import DocumentoForm from '../DocumentoForm'
import { crearDocumento, getCategorias } from '@/services/documentosAdminService'
import { useEffect, useState } from 'react'

export default function NuevoDocumentoPage() {

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
                    { label: 'Gestión de documentos', href: '/admin/documentos' },
                    { label: 'Registrar documento' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Registrar documento</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Registra un nuevo documento en el Sistema Integrado de Gestión.
                </p>
            </div>

            <DocumentoForm
                categorias={categorias}
                onSubmit={crearDocumento}
            />

        </div>
    )

}