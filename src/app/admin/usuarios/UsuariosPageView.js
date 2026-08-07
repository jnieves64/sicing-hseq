'use client'

import { useEffect, useState, useMemo } from 'react'

import {
    getSolicitudes,
    guardarUsuario,
    rechazarUsuario,
    getCargos,
    getRoles
} from '@/services/usuariosService'

import SummaryCards from './SummaryCards'
import FiltersBar from './FiltersBar'
import SolicitudesTable from './SolicitudesTable'

export default function UsuariosPageView() {

    const [solicitudes, setSolicitudes] = useState([])
    const [cargos, setCargos] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [cargoFiltro, setCargoFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')

    const cargarDatos = async () => {

        setLoading(true)
        setError('')

        const [
            { usuarios, error: usuariosError },
            { cargos: cargosData, error: cargosError },
            { roles: rolesData, error: rolesError }
        ] = await Promise.all([
            getSolicitudes(),
            getCargos(),
            getRoles()
        ])

        if (usuariosError || cargosError || rolesError) {
            setError('No se pudieron cargar las solicitudes.')
            setLoading(false)
            return
        }

        setSolicitudes(usuarios)
        setCargos(cargosData)
        setRoles(rolesData)
        setLoading(false)

    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const solicitudesFiltradas = useMemo(() => {

        return solicitudes
            .map((usuario) => ({
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                cargo_id: usuario.cargo_id,
                rol_id: usuario.rol_id,
                estado: usuario.aprobado ? 'aprobado' : 'pendiente',
                fecha: new Date(usuario.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            }))
            .filter((solicitud) => {
                if (cargoFiltro && String(solicitud.cargo_id) !== cargoFiltro) return false
                if (estadoFiltro && solicitud.estado !== estadoFiltro) return false
                return true
            })

    }, [solicitudes, cargoFiltro, estadoFiltro])

    const pendientesCount = solicitudes.filter((u) => !u.aprobado).length

    const handleGuardar = async (usuarioId, { rolId, cargoId }) => {

        const { error } = await guardarUsuario(usuarioId, { rolId, cargoId })

        if (error) {
            setError('No se pudo guardar el cambio.')
            return
        }

        await cargarDatos()

    }

    const handleRechazar = async (usuarioId) => {

        const confirmado = window.confirm(
            '¿Seguro que quieres rechazar y eliminar esta solicitud? Esta acción no se puede deshacer.'
        )

        if (!confirmado) return

        const { error } = await rechazarUsuario(usuarioId)

        if (error) {
            setError('No se pudo rechazar la solicitud.')
            return
        }

        await cargarDatos()

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando solicitudes...</p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">

            <div>
                <h1 className="text-2xl font-semibold text-black">Solicitudes de acceso</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Administra las solicitudes de registro enviadas por nuevos usuarios del Portal SIG.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <SummaryCards
                pendientes={pendientesCount}
                total={solicitudes.length}
            />

            <FiltersBar
                cargos={cargos}
                cargoFiltro={cargoFiltro}
                onCargoChange={setCargoFiltro}
                estadoFiltro={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            <SolicitudesTable
                solicitudes={solicitudesFiltradas}
                roles={roles}
                cargos={cargos}
                onGuardar={handleGuardar}
                onRechazar={handleRechazar}
            />

        </div>
    );

}