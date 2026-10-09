'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
    getIndicadoresAdmin,
    toggleActivoIndicador,
    eliminarIndicador
} from '@/services/indicadoresAdminService'

import SummaryCards from './SummaryCards'
import IndicadoresTable from './IndicadoresTable'

export default function IndicadoresAdminPageView() {

    const [indicadores, setIndicadores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Solo la primera carga muestra "Cargando..."; después de una acción
    // la lista se refresca en silencio, sin que la página parpadee.
    const cargarDatos = async (mostrarCarga = true) => {

        if (mostrarCarga) setLoading(true)
        setError('')

        const { indicadores: data, error } = await getIndicadoresAdmin()

        if (error) {
            setError('No se pudieron cargar los indicadores.')
            setLoading(false)
            return
        }

        setIndicadores(data)
        setLoading(false)

    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const activosCount = indicadores.filter((i) => i.activo).length
    const inactivosCount = indicadores.filter((i) => !i.activo).length

    const handleToggleActivo = async (id, nuevoEstado) => {

        const { error } = await toggleActivoIndicador(id, nuevoEstado)

        if (error) {
            setError('No se pudo actualizar el estado del indicador.')
            return
        }

        await cargarDatos(false)

    }

    const handleEliminar = async (id) => {

        const confirmado = window.confirm(
            '¿Seguro que quieres eliminar este indicador? Esta acción no se puede deshacer.'
        )

        if (!confirmado) return

        const { error } = await eliminarIndicador(id)

        if (error) {
            setError('No se pudo eliminar el indicador.')
            return
        }

        await cargarDatos(false)

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando indicadores...</p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Gestión de indicadores</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra los indicadores que ven los usuarios en el portal.
                    </p>
                </div>

                <Link
                    href="/admin/indicadores/nuevo"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-[#ebbb18] hover:brightness-95 shrink-0"
                >
                    Nuevo indicador
                </Link>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <SummaryCards
                total={indicadores.length}
                activos={activosCount}
                inactivos={inactivosCount}
            />

            <IndicadoresTable
                indicadores={indicadores}
                onToggleActivo={handleToggleActivo}
                onEliminar={handleEliminar}
            />

        </div>
    );

}