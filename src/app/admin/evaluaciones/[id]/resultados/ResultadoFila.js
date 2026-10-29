'use client'

import { useState } from 'react'

import EstadoBadge from '@/app/evaluaciones/EstadoEvaluacion'
import DetalleRespuestas from './DetalleRespuestas'

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function ResultadoFila({ resultado, onHabilitar }) {

  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <tr className="border-b border-gray-100">

        <td className="py-3 px-4">
          <p className="text-sm font-medium text-black">{resultado.nombre}</p>
          {resultado.intentos_previos > 0 && (
            <p className="text-xs text-gray-400">
              {resultado.intentos_previos} intento{resultado.intentos_previos === 1 ? '' : 's'} anterior{resultado.intentos_previos === 1 ? '' : 'es'}
            </p>
          )}
        </td>

        <td className="py-3 px-4 text-sm text-gray-500">
          {resultado.cargo || 'Sin cargo'}
        </td>

        <td className="py-3 px-4 text-sm text-gray-500">
          {resultado.puntaje} de {resultado.puntaje_maximo}
        </td>

        <td className="py-3 px-4">
          <EstadoBadge estado={resultado.aprobado ? 'aprobada' : 'refuerzo'} />
        </td>

        <td className="py-3 px-4 text-sm text-gray-500">
          {formatearFecha(resultado.fecha)}
        </td>

        <td className="py-3 px-4">
          <div className="flex flex-wrap items-center gap-2 justify-end">

            <button
              type="button"
              onClick={() => setAbierto(!abierto)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {abierto ? 'Ocultar detalle' : 'Ver detalle'}
            </button>

            <button
              type="button"
              onClick={() => onHabilitar(resultado.usuario_id, resultado.nombre)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Habilitar nuevo intento
            </button>

          </div>
        </td>

      </tr>

      {abierto && (
        <tr className="border-b border-gray-100 bg-gray-50">
          <td colSpan={6} className="px-4 py-4">
            <DetalleRespuestas respuestas={resultado.respuestas} />
          </td>
        </tr>
      )}
    </>
  );
}