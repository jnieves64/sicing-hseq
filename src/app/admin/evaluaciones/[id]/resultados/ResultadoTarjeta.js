'use client'

import { useState } from 'react'

import EstadoBadge from '@/app/evaluaciones/EstadoEvaluacion'
import DetalleRespuestas from './DetalleRespuestas'
import { formatearFecha } from './ResultadoFila'

export default function ResultadoTarjeta({ resultado, onHabilitar }) {

  const [abierto, setAbierto] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-black">{resultado.nombre}</p>
          <p className="text-xs text-gray-500 mt-0.5">{resultado.cargo || 'Sin cargo'}</p>
          {resultado.intentos_previos > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {resultado.intentos_previos} intento{resultado.intentos_previos === 1 ? '' : 's'} anterior{resultado.intentos_previos === 1 ? '' : 'es'}
            </p>
          )}
        </div>

        <EstadoBadge estado={resultado.aprobado ? 'aprobada' : 'refuerzo'} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{resultado.puntaje} de {resultado.puntaje_maximo} correctas</span>
        <span>{formatearFecha(resultado.fecha)}</span>
      </div>

      {abierto && (
        <div className="pt-2 border-t border-gray-100">
          <DetalleRespuestas respuestas={resultado.respuestas} />
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 justify-end">

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

    </div>
  );
}