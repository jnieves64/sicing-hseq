import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  activo: 'bg-green-100 text-green-700',
  inactivo: 'bg-gray-100 text-gray-500',
}

export default function DocumentoCard({ documento, onEliminar }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-black">{documento.nombre}</p>
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{documento.descripcion}</p>
        </div>

        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${ESTADO_STYLES[documento.estado_publicacion]}`}>
          {documento.estado_publicacion === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {documento.categorias?.length > 0 ? (
          documento.categorias.map((categoria) => (
            <span
              key={categoria.id}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
            >
              {categoria.nombre}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">Sin categoría</span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Versión {documento.version}</span>
        <span>{documento.fecha}</span>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <AccionesCell
          documentoId={documento.id}
          onEliminar={() => onEliminar(documento.id)}
        />
      </div>

    </div>
  );
}