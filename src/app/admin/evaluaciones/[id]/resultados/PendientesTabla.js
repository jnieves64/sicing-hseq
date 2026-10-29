export default function PendientesTabla({ pendientes = [] }) {

  if (pendientes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay usuarios pendientes con los filtros actuales.
        </p>
      </div>
    );
  }

  const nota = (pendiente) =>
    pendiente.intentos_previos > 0 ? 'Intento habilitado' : null

  return (
    <>
      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden space-y-3">
        {pendientes.map((pendiente) => (
          <div
            key={pendiente.usuario_id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-2"
          >
            <div>
              <p className="text-sm font-medium text-black">{pendiente.nombre}</p>
              <p className="text-xs text-gray-500 mt-0.5">{pendiente.cargo || 'Sin cargo'}</p>
            </div>

            {nota(pendiente) && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 shrink-0">
                {nota(pendiente)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Vista de tabla — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Usuario</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Cargo</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Observación</th>
            </tr>
          </thead>

          <tbody>
            {pendientes.map((pendiente) => (
              <tr key={pendiente.usuario_id} className="border-b border-gray-100">

                <td className="py-3 px-4 text-sm font-medium text-black">
                  {pendiente.nombre}
                </td>

                <td className="py-3 px-4 text-sm text-gray-500">
                  {pendiente.cargo || 'Sin cargo'}
                </td>

                <td className="py-3 px-4">
                  {nota(pendiente) ? (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      {nota(pendiente)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Sin presentar</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}