export default function SummaryCards({ total = 0, activos = 0, inactivos = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Total indicadores</p>
        <p className="text-3xl font-semibold text-black mt-1">{total}</p>
        <p className="text-xs text-gray-400 mt-1">Registrados en total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Activos</p>
        <p className="text-3xl font-semibold text-black mt-1">{activos}</p>
        <p className="text-xs text-gray-400 mt-1">Visibles para los usuarios</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Inactivos</p>
        <p className="text-3xl font-semibold text-black mt-1">{inactivos}</p>
        <p className="text-xs text-gray-400 mt-1">Ocultos para los usuarios</p>
      </div>

    </div>
  );
}