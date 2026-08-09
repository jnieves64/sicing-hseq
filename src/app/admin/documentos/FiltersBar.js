'use client'

export default function FiltersBar({
  categorias = [],
  categoriaFiltro,
  onCategoriaChange,
  estadoFiltro,
  onEstadoChange,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-6">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={categoriaFiltro}
          onChange={(event) => onCategoriaChange(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
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