'use client'

import Link from 'next/link'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function AccionesCell({
  campanaId,
  activo,
  onToggleActivo,
  onEliminar,
  onMoverArriba,
  onMoverAbajo,
  reordenarDeshabilitado,
}) {
  return (
    <div className="flex items-center gap-2 justify-end flex-wrap">

      <div className="flex gap-1">
        <button
            onClick={onMoverArriba}
            disabled={reordenarDeshabilitado}
            title={reordenarDeshabilitado ? 'Quita los filtros para reordenar' : 'Mover arriba'}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
            <ChevronUp size={14} />
        </button>
        <button
            onClick={onMoverAbajo}
            disabled={reordenarDeshabilitado}
            title={reordenarDeshabilitado ? 'Quita los filtros para reordenar' : 'Mover abajo'}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
            <ChevronDown size={14} />
        </button>
      </div>

      <button
        onClick={onToggleActivo}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
          activo
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {activo ? 'Despublicar' : 'Publicar'}
      </button>

      <Link
        href={`/admin/campanas/${campanaId}/editar`}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Editar
      </Link>

      <button
        onClick={onEliminar}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
      >
        Eliminar
      </button>

    </div>
  );
}