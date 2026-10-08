import CampanaRow from './CampanaRow'
import CampanaCard from './CampanaCard'

export default function CampanasTable({
  campanas = [],
  onToggleActivo,
  onEliminar,
  onMover,
  reordenarDeshabilitado,
}) {

  if (campanas.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-sm text-gray-400">
          No hay publicaciones que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden space-y-3">
        {campanas.map((campana) => (
          <CampanaCard
            key={campana.id}
            campana={campana}
            onToggleActivo={onToggleActivo}
            onEliminar={onEliminar}
            onMover={onMover}
            reordenarDeshabilitado={reordenarDeshabilitado}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Descripción</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Tipo</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Fecha</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-4">Estado</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase py-3 px-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {campanas.map((campana) => (
              <CampanaRow
                key={campana.id}
                campana={campana}
                onToggleActivo={onToggleActivo}
                onEliminar={onEliminar}
                onMover={onMover}
                reordenarDeshabilitado={reordenarDeshabilitado}
              />
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}