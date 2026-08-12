import SolicitudRow from './SolicitudRow'
import SolicitudCard from './SolicitudCard'

export default function SolicitudesTable({
  solicitudes = [],
  roles = [],
  cargos = [],
  onGuardar,
  onRechazar,
}) {

  if (solicitudes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay solicitudes que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden space-y-3">
        {solicitudes.map((solicitud) => (
          <SolicitudCard
            key={solicitud.id}
            solicitud={solicitud}
            roles={roles}
            cargos={cargos}
            onGuardar={onGuardar}
            onRechazar={onRechazar}
          />
        ))}
      </div>

      {/* Vista de tabla — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Usuario</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Correo</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Cargo</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Rol</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Fecha</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {solicitudes.map((solicitud) => (
              <SolicitudRow
                key={solicitud.id}
                solicitud={solicitud}
                roles={roles}
                cargos={cargos}
                onGuardar={onGuardar}
                onRechazar={onRechazar}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}