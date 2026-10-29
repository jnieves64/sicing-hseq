'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

import {
    getEvaluacionesAdmin,
    toggleActivoEvaluacion,
    eliminarEvaluacion
} from '@/services/evaluacionesAdminService'
import { getCategorias } from '@/services/documentosAdminService'

import SummaryCards from './SummaryCards'
import FiltersBar from './FiltersBar'
import EvaluacionesTable from './EvaluacionesTable'

function textoResultados(evaluacion) {

    const presentadas = evaluacion.total_intentos
    const aprobadas = evaluacion.total_aprobados

    if (presentadas === 0) return 'Sin resultados'

    return `${presentadas} presentada${presentadas === 1 ? '' : 's'} · ${aprobadas} aprobada${aprobadas === 1 ? '' : 's'}`

}

export default function EvaluacionesAdminPageView() {

    const [evaluaciones, setEvaluaciones] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')

    // Solo la primera carga muestra "Cargando…"; las recargas tras una acción son silenciosas
    const cargarDatos = async (mostrarCarga = true) => {

        if (mostrarCarga) setLoading(true)
        setError('')

        const { evaluaciones: evaluacionesData, error: evaluacionesError } = await getEvaluacionesAdmin()

        if (evaluacionesError) {
            setError('No se pudieron cargar las evaluaciones.')
            setLoading(false)
            return
        }

        setEvaluaciones(evaluacionesData)
        setLoading(false)

    }

    const cargarCategorias = async () => {

        const { categorias: categoriasData, error: categoriasError } = await getCategorias()

        if (categoriasError) {
            setError('No se pudieron cargar las categorías.')
            return
        }

        setCategorias(categoriasData)

    }

    useEffect(() => {
        cargarDatos()
        cargarCategorias()
    }, [])

    const evaluacionesFiltradas = useMemo(() => {

        return evaluaciones
            .map((evaluacion) => ({
                ...evaluacion,
                fecha: new Date(evaluacion.updated_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                resultadosTexto: textoResultados(evaluacion)
            }))
            .filter((evaluacion) => {
                if (categoriaFiltro && !evaluacion.categorias?.some((c) => String(c.id) === categoriaFiltro)) return false
                if (estadoFiltro === 'publicada' && !evaluacion.activo) return false
                if (estadoFiltro === 'borrador' && evaluacion.activo) return false
                return true
            })

    }, [evaluaciones, categoriaFiltro, estadoFiltro])

    const publicadasCount = evaluaciones.filter((e) => e.activo).length
    const borradoresCount = evaluaciones.filter((e) => !e.activo).length

    const handleToggle = async (evaluacionId, nuevoEstado) => {

        setError('')

        const { error } = await toggleActivoEvaluacion(evaluacionId, nuevoEstado)

        if (error) {
            setError('No se pudo cambiar el estado de la evaluación.')
            return
        }

        await cargarDatos(false)

    }

    const handleEliminar = async (evaluacionId) => {

        const evaluacion = evaluaciones.find((e) => e.id === evaluacionId)
        const resultados = evaluacion?.total_historial || 0

        const aviso = resultados > 0
            ? `Esta evaluación tiene ${resultados} resultado${resultados === 1 ? '' : 's'} registrado${resultados === 1 ? '' : 's'} que también se eliminar${resultados === 1 ? 'á' : 'án'}. `
            : ''

        const confirmado = window.confirm(
            `${aviso}¿Seguro que quieres eliminar esta evaluación? Esta acción no se puede deshacer.`
        )

        if (!confirmado) return

        setError('')

        const { error } = await eliminarEvaluacion(evaluacionId)

        if (error) {
            setError('No se pudo eliminar la evaluación.')
            return
        }

        await cargarDatos(false)

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando evaluaciones...</p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Gestión de evaluaciones</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Crea y publica evaluaciones de conocimiento sobre los documentos del Sistema Integrado de Gestión.
                    </p>
                </div>

                <Link
                    href="/admin/evaluaciones/nuevo"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-[#ebbb18] hover:brightness-95"
                >
                    Nueva evaluación
                </Link>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <SummaryCards
                total={evaluaciones.length}
                publicadas={publicadasCount}
                borradores={borradoresCount}
            />

            <FiltersBar
                categorias={categorias}
                categoriaFiltro={categoriaFiltro}
                onCategoriaChange={setCategoriaFiltro}
                estadoFiltro={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            <EvaluacionesTable
                evaluaciones={evaluacionesFiltradas}
                onToggle={handleToggle}
                onEliminar={handleEliminar}
            />

        </div>
    );

}