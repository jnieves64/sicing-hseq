import ResultadoFila from './ResultadoFila'
import ResultadoTarjeta from './ResultadoTarjeta'

export default function ResultadosTabla({ resultados = [], onHabilitar }) {

  if (resultados.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay resultados que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden space-y-3">
        {resultados.map((resultado) => (
          <ResultadoTarjeta
            key={resultado.intento_id}
            resultado={resultado}
            onHabilitar={onHabilitar}
          />
        ))}
      </div>

      {/* Vista de tabla — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Usuario</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Cargo</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Puntaje</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Fecha</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {resultados.map((resultado) => (
              <ResultadoFila
                key={resultado.intento_id}
                resultado={resultado}
                onHabilitar={onHabilitar}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}