export default function SummaryCards({ total = 0, activas = 0, inactivas = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Total publicaciones</p>
        <p className="text-3xl font-semibold text-black mt-1">{total}</p>
        <p className="text-xs text-gray-400 mt-1">Registradas en total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Activas</p>
        <p className="text-3xl font-semibold text-black mt-1">{activas}</p>
        <p className="text-xs text-gray-400 mt-1">Visibles en el feed</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Inactivas</p>
        <p className="text-3xl font-semibold text-black mt-1">{inactivas}</p>
        <p className="text-xs text-gray-400 mt-1">Ocultas del feed</p>
      </div>

    </div>
  );
}