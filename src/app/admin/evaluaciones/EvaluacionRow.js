import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  publicada: 'bg-green-100 text-green-700',
  borrador: 'bg-gray-100 text-gray-500',
}

export default function EvaluacionRow({ evaluacion, onToggle, onEliminar }) {

  const estado = evaluacion.activo ? 'publicada' : 'borrador'

  return (
    <tr className="border-b border-gray-100">

      <td className="py-3 px-4">
        <p className="text-sm font-medium text-black">{evaluacion.titulo}</p>
        {evaluacion.codigo && (
          <p className="text-xs text-gray-400">{evaluacion.codigo}</p>
        )}
        <p className="text-xs text-gray-500 line-clamp-1">{evaluacion.descripcion}</p>
      </td>

      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {evaluacion.categorias?.length > 0 ? (
            evaluacion.categorias.map((categoria) => (
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
        {evaluacion.total_preguntas}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {evaluacion.resultadosTexto}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {evaluacion.fecha}
      </td>

      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ESTADO_STYLES[estado]}`}>
          {evaluacion.activo ? 'Publicada' : 'Borrador'}
        </span>
      </td>

      <td className="py-3 px-4">
        <AccionesCell
          evaluacionId={evaluacion.id}
          activo={evaluacion.activo}
          onToggle={() => onToggle(evaluacion.id, !evaluacion.activo)}
          onEliminar={() => onEliminar(evaluacion.id)}
        />
      </td>

    </tr>
  );
}