'use client'

import { useState } from 'react'
import RolSelect from './RolSelect'
import CargoSelect from './CargoSelect'
import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobado: 'bg-green-100 text-green-700',
}

export default function SolicitudRow({
  solicitud,
  roles,
  cargos,
  onGuardar,
  onRechazar,
}) {

  const [rolId, setRolId] = useState(solicitud.rol_id)
  const [cargoId, setCargoId] = useState(solicitud.cargo_id)

  const dirty = rolId !== solicitud.rol_id || cargoId !== solicitud.cargo_id
  const incompleto = !rolId || !cargoId

  return (
    <tr className="border-b border-gray-100">

      <td className="py-3 px-4">
        <p className="text-sm font-medium text-black">{solicitud.nombre}</p>
      </td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {solicitud.correo}
      </td>

      <td className="py-3 px-4">
        <CargoSelect
          cargos={cargos}
          value={cargoId}
          onChange={setCargoId}
        />
      </td>

      <td className="py-3 px-4">
        <RolSelect
          roles={roles}
          value={rolId}
          onChange={setRolId}
        />
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {solicitud.fecha}
      </td>

      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ESTADO_STYLES[solicitud.estado]}`}>
          {solicitud.estado === 'pendiente' ? 'Pendiente' : 'Aprobado'}
        </span>
      </td>

      <td className="py-3 px-4">
        <AccionesCell
          estado={solicitud.estado}
          dirty={dirty}
          disabled={incompleto}
          onGuardar={() => onGuardar(solicitud.id, { rolId, cargoId })}
          onRechazar={() => onRechazar(solicitud.id)}
        />
      </td>

    </tr>
  );
}