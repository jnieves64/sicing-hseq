'use client'

export default function FiltersBar({
  tipoFiltro,
  onTipoChange,
  estadoFiltro,
  onEstadoChange,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={tipoFiltro}
          onChange={(event) => onTipoChange(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
        >
          <option value="">Todos los tipos</option>
          <option value="foto">Fotos</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Estado</label>
        <select
          value={estadoFiltro}
          onChange={(event) => onEstadoChange(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

    </div>
  );
}