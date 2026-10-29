'use client'

import Link from 'next/link'

export default function AccionesCell({ evaluacionId, activo, onToggle, onEliminar }) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-end">

      <button
        onClick={onToggle}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
          activo
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {activo ? 'Despublicar' : 'Publicar'}
      </button>

      <Link
        href={`/admin/evaluaciones/${evaluacionId}/resultados`}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Resultados
      </Link>

      <Link
        href={`/admin/evaluaciones/${evaluacionId}/editar`}
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