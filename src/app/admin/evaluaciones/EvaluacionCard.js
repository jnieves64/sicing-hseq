import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  publicada: 'bg-green-100 text-green-700',
  borrador: 'bg-gray-100 text-gray-500',
}

export default function EvaluacionCard({ evaluacion, onToggle, onEliminar }) {

  const estado = evaluacion.activo ? 'publicada' : 'borrador'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-black">{evaluacion.titulo}</p>
          {evaluacion.codigo && (
            <p className="text-xs text-gray-400 mt-0.5">{evaluacion.codigo}</p>
          )}
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{evaluacion.descripcion}</p>
        </div>

        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${ESTADO_STYLES[estado]}`}>
          {evaluacion.activo ? 'Publicada' : 'Borrador'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {evaluacion.categorias?.length > 0 ? (
          evaluacion.categorias.map((categoria) => (
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
        <span>{evaluacion.total_preguntas} pregunta{evaluacion.total_preguntas === 1 ? '' : 's'}</span>
        <span>{evaluacion.fecha}</span>
      </div>

      <p className="text-xs text-gray-500">{evaluacion.resultadosTexto}</p>

      <div className="pt-2 border-t border-gray-100">
        <AccionesCell
          evaluacionId={evaluacion.id}
          activo={evaluacion.activo}
          onToggle={() => onToggle(evaluacion.id, !evaluacion.activo)}
          onEliminar={() => onEliminar(evaluacion.id)}
        />
      </div>

    </div>
  );
}