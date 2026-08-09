import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  activo: 'bg-green-100 text-green-700',
  inactivo: 'bg-gray-100 text-gray-500',
}

export default function DocumentoRow({ documento, onEliminar }) {
  return (
    <tr className="border-b border-gray-100">

      <td className="py-3 px-4">
        <p className="text-sm font-medium text-black">{documento.nombre}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{documento.descripcion}</p>
      </td>

      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {documento.categorias?.length > 0 ? (
            documento.categorias.map((categoria) => (
              <span
                key={categoria.id}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap"
              >
                {categoria.nombre}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">Sin categoría</span>
          )}
        </div>
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {documento.version}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {documento.fecha}
      </td>

      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ESTADO_STYLES[documento.estado_publicacion]}`}>
          {documento.estado_publicacion === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="py-3 px-4">
        <AccionesCell
          documentoId={documento.id}
          onEliminar={() => onEliminar(documento.id)}
        />
      </td>

    </tr>
  );
}