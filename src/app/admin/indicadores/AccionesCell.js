'use client'

import Link from 'next/link'

export default function AccionesCell({ indicadorId, activo, onToggleActivo, onEliminar }) {
  return (
    <div className="flex items-center gap-2 justify-end flex-wrap">

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
        href={`/admin/indicadores/${indicadorId}/editar`}
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