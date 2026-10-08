import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-gray-100 text-gray-500',
}

export default function CampanaRow({
  campana,
  onToggleActivo,
  onEliminar,
  onMover,
  reordenarDeshabilitado,
}) {

  const descripcionCorta = campana.descripcion?.length > 80
    ? campana.descripcion.slice(0, 80) + '...'
    : campana.descripcion

  const badgeTipo = campana.tipo === 'video'
    ? '🎥 Video'
    : `📷 ${campana.medios.length} foto${campana.medios.length !== 1 ? 's' : ''}`

  return (
    <tr className="border-b border-gray-100">

      <td className="py-3 px-4 max-w-xs">
        <p className="text-sm text-black">{descripcionCorta}</p>
      </td>

      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
        {badgeTipo}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
        {campana.fecha}
      </td>

      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ESTADO_STYLES[campana.activo]}`}>
          {campana.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="py-3 px-4">
        <AccionesCell
          campanaId={campana.id}
          activo={campana.activo}
          onToggleActivo={() => onToggleActivo(campana.id, !campana.activo)}
          onEliminar={() => onEliminar(campana.id)}
          onMoverArriba={() => onMover(campana.id, 'arriba')}
          onMoverAbajo={() => onMover(campana.id, 'abajo')}
          reordenarDeshabilitado={reordenarDeshabilitado}
        />
      </td>

    </tr>
  );
}