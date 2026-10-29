'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import {
    getResultadosEvaluacion,
    habilitarNuevoIntento
} from '@/services/evaluacionesAdminService'

import ResumenResultados from './ResumenResultados'
import FiltrosResultados from './FiltrosResultados'
import ResultadosTabla from './ResultadosTabla'
import PendientesTabla from './PendientesTabla'

export default function ResultadosPageView() {

    const { id } = useParams()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [pestana, setPestana] = useState('presentaron')
    const [cargoFiltro, setCargoFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')

    // Solo la primera carga muestra "Cargando…"; las recargas tras una acción son silenciosas
    const cargarDatos = async (mostrarCarga = true) => {

        if (mostrarCarga) setLoading(true)

        const { dato, error: cargaError } = await getResultadosEvaluacion(id)

        if (cargaError) {
            setError('No se pudieron cargar los resultados.')
            setLoading(false)
            return
        }

        setData(dato)
        setLoading(false)

    }

    useEffect(() => {
        cargarDatos()
    }, [id])

    const resultados = data?.resultados || []
    const pendientes = data?.pendientes || []

    const cargos = useMemo(() => {

        const nombres = new Set()

        resultados.forEach((r) => r.cargo && nombres.add(r.cargo))
        pendientes.forEach((p) => p.cargo && nombres.add(p.cargo))

        return Array.from(nombres).sort((a, b) => a.localeCompare(b, 'es'))

    }, [resultados, pendientes])

    const resultadosFiltrados = useMemo(() => {

        return resultados
            .filter((r) => {
                if (cargoFiltro && r.cargo !== cargoFiltro) return false
                if (estadoFiltro === 'aprobada' && !r.aprobado) return false
                if (estadoFiltro === 'refuerzo' && r.aprobado) return false
                return true
            })
            // Los que requieren refuerzo primero; luego los más recientes
            .sort((a, b) => {
                if (a.aprobado !== b.aprobado) return a.aprobado ? 1 : -1
                return new Date(b.fecha) - new Date(a.fecha)
            })

    }, [resultados, cargoFiltro, estadoFiltro])

    const pendientesFiltrados = useMemo(() => {
        return pendientes.filter((p) => !cargoFiltro || p.cargo === cargoFiltro)
    }, [pendientes, cargoFiltro])

    const aprobaron = resultados.filter((r) => r.aprobado).length
    const refuerzo = resultados.length - aprobaron

    const handleHabilitar = async (usuarioId, nombre) => {

        const confirmado = window.confirm(
            `¿Habilitar un nuevo intento a ${nombre}? Su resultado actual quedará anulado y se conservará como historial.`
        )

        if (!confirmado) return

        setError('')

        const { error: habilitarError } = await habilitarNuevoIntento(id, usuarioId)

        if (habilitarError) {
            setError('No se pudo habilitar el nuevo intento.')
            return
        }

        await cargarDatos(false)

    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-sm text-gray-500">Cargando resultados...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-8">
                <p className="text-sm text-red-600">{error || 'No se pudieron cargar los resultados.'}</p>
            </div>
        )
    }

    const { evaluacion } = data

    const botonPestana = (clave, etiqueta, cantidad) => (
        <button
            type="button"
            onClick={() => setPestana(clave)}
            className={`
                text-sm font-medium px-4 py-2 rounded-lg
                ${pestana === clave
                    ? 'bg-[#ebbb18]/20 text-black'
                    : 'text-gray-600 hover:bg-gray-100'}
            `}
        >
            {etiqueta} ({cantidad})
        </button>
    )

    return (
        <div className="p-8 space-y-6">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de evaluaciones', href: '/admin/evaluaciones' },
                    { label: 'Resultados' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Resultados: {evaluacion.titulo}</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {evaluacion.codigo ? `${evaluacion.codigo} · ` : ''}
                    {evaluacion.total_preguntas} pregunta{evaluacion.total_preguntas === 1 ? '' : 's'}
                    {' · '}
                    {evaluacion.activo ? 'Publicada' : 'Borrador'}
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <ResumenResultados
                presentaron={resultados.length}
                aprobaron={aprobaron}
                refuerzo={refuerzo}
                pendientes={pendientes.length}
            />

            <div className="flex flex-wrap gap-2">
                {botonPestana('presentaron', 'Presentaron', resultados.length)}
                {botonPestana('pendientes', 'Pendientes', pendientes.length)}
            </div>

            <FiltrosResultados
                cargos={cargos}
                cargoFiltro={cargoFiltro}
                onCargoChange={setCargoFiltro}
                mostrarEstado={pestana === 'presentaron'}
                estadoFiltro={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            {pestana === 'presentaron' ? (
                <ResultadosTabla
                    resultados={resultadosFiltrados}
                    onHabilitar={handleHabilitar}
                />
            ) : (
                <PendientesTabla pendientes={pendientesFiltrados} />
            )}

        </div>
    );

}