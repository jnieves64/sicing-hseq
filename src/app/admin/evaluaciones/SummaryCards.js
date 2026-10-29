export default function SummaryCards({ total = 0, publicadas = 0, borradores = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Total evaluaciones</p>
        <p className="text-3xl font-semibold text-black mt-1">{total}</p>
        <p className="text-xs text-gray-400 mt-1">Registradas en total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Publicadas</p>
        <p className="text-3xl font-semibold text-black mt-1">{publicadas}</p>
        <p className="text-xs text-gray-400 mt-1">Visibles en el portal</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Borradores</p>
        <p className="text-3xl font-semibold text-black mt-1">{borradores}</p>
        <p className="text-xs text-gray-400 mt-1">Ocultas del portal</p>
      </div>

    </div>
  );
}