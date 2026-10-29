'use client'

export default function FiltrosResultados({
  cargos = [],
  cargoFiltro,
  onCargoChange,
  mostrarEstado = true,
  estadoFiltro,
  onEstadoChange,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Cargo</label>
        <select
          value={cargoFiltro}
          onChange={(event) => onCargoChange(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
        >
          <option value="">Todos los cargos</option>
          {cargos.map((cargo) => (
            <option key={cargo} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </div>

      {mostrarEstado && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select
            value={estadoFiltro}
            onChange={(event) => onEstadoChange(event.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
          >
            <option value="">Todos los estados</option>
            <option value="aprobada">Aprobada</option>
            <option value="refuerzo">Requiere refuerzo</option>
          </select>
        </div>
      )}

    </div>
  );
}