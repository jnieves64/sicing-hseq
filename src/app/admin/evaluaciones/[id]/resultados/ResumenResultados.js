export default function ResumenResultados({
  presentaron = 0,
  aprobaron = 0,
  refuerzo = 0,
  pendientes = 0,
  minimo = 0,
  total = 0
}) {

  const exigeTodas = minimo >= total

  const tarjetas = [
    { titulo: 'Presentaron', valor: presentaron, nota: 'Con resultado vigente' },
    {
      titulo: 'Aprobaron',
      valor: aprobaron,
      nota: exigeTodas ? 'Todas correctas' : `${minimo} o más correctas`
    },
    {
      titulo: 'Requieren refuerzo',
      valor: refuerzo,
      nota: exigeTodas ? 'Con al menos una falla' : `Menos de ${minimo} correctas`
    },
    { titulo: 'Pendientes', valor: pendientes, nota: 'Aún sin presentar' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">

      {tarjetas.map((t) => (
        <div key={t.titulo} className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">{t.titulo}</p>
          <p className="text-3xl font-semibold text-black mt-1">{t.valor}</p>
          <p className="text-xs text-gray-400 mt-1">{t.nota}</p>
        </div>
      ))}

    </div>
  );
}