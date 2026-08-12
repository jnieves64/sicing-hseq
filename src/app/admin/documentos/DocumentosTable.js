import DocumentoRow from './DocumentoRow'
import DocumentoCard from './DocumentoCard'

export default function DocumentosTable({ documentos = [], onEliminar }) {

  if (documentos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay documentos que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden space-y-3">
        {documentos.map((documento) => (
          <DocumentoCard
            key={documento.id}
            documento={documento}
            onEliminar={onEliminar}
          />
        ))}
      </div>

      {/* Vista de tabla — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Documento</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Categorías</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Versión</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Fecha</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {documentos.map((documento) => (
              <DocumentoRow
                key={documento.id}
                documento={documento}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}