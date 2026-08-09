'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

import {
    getDocumentos,
    eliminarDocumento,
    getCategorias
} from '@/services/documentosAdminService'

import SummaryCards from './SummaryCards'
import FiltersBar from './FiltersBar'
import DocumentosTable from './DocumentosTable'

export default function DocumentosPageView() {

    const [documentos, setDocumentos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')

    const cargarDatos = async () => {

        setLoading(true)
        setError('')

        const [
            { documentos: documentosData, error: documentosError },
            { categorias: categoriasData, error: categoriasError }
        ] = await Promise.all([
            getDocumentos(),
            getCategorias()
        ])

        if (documentosError || categoriasError) {
            setError('No se pudieron cargar los documentos.')
            setLoading(false)
            return
        }

        setDocumentos(documentosData)
        setCategorias(categoriasData)
        setLoading(false)

    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const documentosFiltrados = useMemo(() => {

        return documentos
            .map((documento) => ({
                ...documento,
                fecha: new Date(documento.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            }))
            .filter((documento) => {
                if (categoriaFiltro && !documento.categorias?.some((c) => String(c.id) === categoriaFiltro)) return false
                if (estadoFiltro && documento.estado_publicacion !== estadoFiltro) return false
                return true
            })

    }, [documentos, categoriaFiltro, estadoFiltro])

    const activosCount = documentos.filter((d) => d.estado_publicacion === 'activo').length
    const inactivosCount = documentos.filter((d) => d.estado_publicacion === 'inactivo').length

    const handleEliminar = async (documentoId) => {

        const confirmado = window.confirm(
            '¿Seguro que quieres eliminar este documento? Esta acción no se puede deshacer.'
        )

        if (!confirmado) return

        const { error } = await eliminarDocumento(documentoId)

        if (error) {
            setError('No se pudo eliminar el documento.')
            return
        }

        await cargarDatos()

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando documentos...</p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Gestión de documentos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra los documentos disponibles en el Sistema Integrado de Gestión.
                    </p>
                </div>

                <Link
                    href="/admin/documentos/nuevo"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-[#ebbb18] hover:brightness-95"
                >
                    Nuevo documento
                </Link>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <SummaryCards
                total={documentos.length}
                activos={activosCount}
                inactivos={inactivosCount}
            />

            <FiltersBar
                categorias={categorias}
                categoriaFiltro={categoriaFiltro}
                onCategoriaChange={setCategoriaFiltro}
                estadoFiltro={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            <DocumentosTable
                documentos={documentosFiltrados}
                onEliminar={handleEliminar}
            />

        </div>
    );

}