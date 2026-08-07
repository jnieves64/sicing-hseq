export default function SummaryCards({ pendientes = 0, total = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md">

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Pendientes</p>
        <p className="text-3xl font-semibold text-black mt-1">{pendientes}</p>
        <p className="text-xs text-gray-400 mt-1">En espera de revisión</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Total solicitudes</p>
        <p className="text-3xl font-semibold text-black mt-1">{total}</p>
        <p className="text-xs text-gray-400 mt-1">Registradas en total</p>
      </div>

    </div>
  );
}