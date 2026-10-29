import EvaluacionRow from './EvaluacionRow'
import EvaluacionCard from './EvaluacionCard'

export default function EvaluacionesTable({ evaluaciones = [], onToggle, onEliminar }) {

  if (evaluaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay evaluaciones que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden space-y-3">
        {evaluaciones.map((evaluacion) => (
          <EvaluacionCard
            key={evaluacion.id}
            evaluacion={evaluacion}
            onToggle={onToggle}
            onEliminar={onEliminar}
          />
        ))}
      </div>

      {/* Vista de tabla — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Evaluación</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Categorías</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Preguntas</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Resultados</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Actualizada</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {evaluaciones.map((evaluacion) => (
              <EvaluacionRow
                key={evaluacion.id}
                evaluacion={evaluacion}
                onToggle={onToggle}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}