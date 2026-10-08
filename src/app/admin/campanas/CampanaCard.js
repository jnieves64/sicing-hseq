import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-gray-100 text-gray-500',
}

export default function CampanaCard({
  campana,
  onToggleActivo,
  onEliminar,
  onMover,
  reordenarDeshabilitado,
}) {

  const badgeTipo = campana.tipo === 'video'
    ? '🎥 Video'
    : `📷 ${campana.medios.length} foto${campana.medios.length !== 1 ? 's' : ''}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-black line-clamp-3">{campana.descripcion}</p>

        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${ESTADO_STYLES[campana.activo]}`}>
          {campana.activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{badgeTipo}</span>
        <span>{campana.fecha}</span>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <AccionesCell
          campanaId={campana.id}
          activo={campana.activo}
          onToggleActivo={() => onToggleActivo(campana.id, !campana.activo)}
          onEliminar={() => onEliminar(campana.id)}
          onMoverArriba={() => onMover(campana.id, 'arriba')}
          onMoverAbajo={() => onMover(campana.id, 'abajo')}
          reordenarDeshabilitado={reordenarDeshabilitado}
        />
      </div>

    </div>
  );
}