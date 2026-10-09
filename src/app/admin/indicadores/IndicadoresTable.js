import IndicadorRow from './IndicadorRow'
import IndicadorAdminCard from './IndicadorAdminCard'

export default function IndicadoresTable({ indicadores = [], onToggleActivo, onEliminar }) {

  if (indicadores.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          Aún no hay indicadores registrados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden space-y-3">
        {indicadores.map((indicador) => (
          <IndicadorAdminCard
            key={indicador.id}
            indicador={indicador}
            onToggleActivo={onToggleActivo}
            onEliminar={onEliminar}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Indicador</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Gráficas</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Actualizado</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {indicadores.map((indicador) => (
              <IndicadorRow
                key={indicador.id}
                indicador={indicador}
                onToggleActivo={onToggleActivo}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}