'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import DocumentoForm from '../../DocumentoForm'
import {
    getDocumentoPorId,
    actualizarDocumento,
    getCategorias
} from '@/services/documentosAdminService'

export default function EditarDocumentoPage() {

    const { id } = useParams()

    const [documento, setDocumento] = useState(null)
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const cargarDatos = async () => {

            const [
                { documento: documentoData, error: documentoError },
                { categorias: categoriasData }
            ] = await Promise.all([
                getDocumentoPorId(id),
                getCategorias()
            ])

            if (documentoError || !documentoData) {
                setError('No se pudo cargar el documento.')
                setLoading(false)
                return
            }

            setDocumento(documentoData)
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
                    { label: 'Gestión de documentos', href: '/admin/documentos' },
                    { label: 'Editar documento' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Editar documento</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Actualiza la información de "{documento.nombre}".
                </p>
            </div>

            <DocumentoForm
                documento={documento}
                categorias={categorias}
                onSubmit={(datos) => actualizarDocumento(id, datos)}
            />

        </div>
    )

}