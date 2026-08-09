'use client'

import Link from 'next/link'

export default function AccionesCell({ documentoId, onEliminar }) {
  return (
    <div className="flex items-center gap-2 justify-end">

      <Link
        href={`/admin/documentos/${documentoId}/editar`}
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