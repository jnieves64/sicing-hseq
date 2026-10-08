'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

import {
    getCampanasAdmin,
    toggleActivoCampana,
    eliminarCampana,
    moverCampana
} from '@/services/campanasAdminService'

import SummaryCards from './SummaryCards'
import FiltersBar from './FiltersBar'
import CampanasTable from './CampanasTable'

export default function CampanasAdminPageView() {

    const [campanas, setCampanas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [tipoFiltro, setTipoFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')

    const cargarDatos = async () => {

        setLoading(true)
        setError('')

        const { campanas: data, error } = await getCampanasAdmin()

        if (error) {
            setError('No se pudieron cargar las publicaciones.')
            setLoading(false)
            return
        }

        setCampanas(data)
        setLoading(false)

    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const campanasFiltradas = useMemo(() => {

        return campanas
            .map((campana) => ({
                ...campana,
                fecha: new Date(campana.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            }))
            .filter((campana) => {
                if (tipoFiltro && campana.tipo !== tipoFiltro) return false
                if (estadoFiltro === 'activo' && !campana.activo) return false
                if (estadoFiltro === 'inactivo' && campana.activo) return false
                return true
            })

    }, [campanas, tipoFiltro, estadoFiltro])

    const activasCount = campanas.filter((c) => c.activo).length
    const inactivasCount = campanas.filter((c) => !c.activo).length

    const handleToggleActivo = async (campanaId, nuevoEstado) => {

        const { error } = await toggleActivoCampana(campanaId, nuevoEstado)

        if (error) {
            setError('No se pudo actualizar el estado de la publicación.')
            return
        }

        await cargarDatos()

    }

    const handleEliminar = async (campanaId) => {

        const confirmado = window.confirm(
            '¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer.'
        )

        if (!confirmado) return

        const { error } = await eliminarCampana(campanaId)

        if (error) {
            setError('No se pudo eliminar la publicación.')
            return
        }

        await cargarDatos()

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando publicaciones...</p>
            </div>
        )
    }

    const reordenarDeshabilitado = Boolean(tipoFiltro || estadoFiltro)

    const handleMover = async (campanaId, direccion) => {

        const { error } = await moverCampana(campanaId, direccion)

        if (error) {
            setError('No se pudo reordenar la publicación.')
            return
        }

        await cargarDatos()

    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Gestión de campañas</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra las publicaciones del feed de Campañas.
                    </p>
                </div>

                <Link
                    href="/admin/campanas/nuevo"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-[#ebbb18] hover:brightness-95"
                >
                    Nueva publicación
                </Link>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <SummaryCards
                total={campanas.length}
                activas={activasCount}
                inactivas={inactivasCount}
            />

            <FiltersBar
                tipoFiltro={tipoFiltro}
                onTipoChange={setTipoFiltro}
                estadoFiltro={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            <CampanasTable
                campanas={campanasFiltradas}
                onToggleActivo={handleToggleActivo}
                onEliminar={handleEliminar}
                onMover={handleMover}
                reordenarDeshabilitado={reordenarDeshabilitado}
            />

        </div>
    );

}