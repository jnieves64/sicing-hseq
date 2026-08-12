'use client'

import { useState } from 'react'
import RolSelect from './RolSelect'
import CargoSelect from './CargoSelect'
import AccionesCell from './AccionesCell'

const ESTADO_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobado: 'bg-green-100 text-green-700',
}

export default function SolicitudCard({
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-black">{solicitud.nombre}</p>
          <p className="text-xs text-gray-500">{solicitud.correo}</p>
        </div>

        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${ESTADO_STYLES[solicitud.estado]}`}>
          {solicitud.estado === 'pendiente' ? 'Pendiente' : 'Aprobado'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Cargo</label>
          <CargoSelect
            cargos={cargos}
            value={cargoId}
            onChange={setCargoId}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Rol</label>
          <RolSelect
            roles={roles}
            value={rolId}
            onChange={setRolId}
          />
        </div>

      </div>

      <p className="text-xs text-gray-400">{solicitud.fecha}</p>

      <div className="pt-2 border-t border-gray-100">
        <AccionesCell
          estado={solicitud.estado}
          dirty={dirty}
          disabled={incompleto}
          onGuardar={() => onGuardar(solicitud.id, { rolId, cargoId })}
          onRechazar={() => onRechazar(solicitud.id)}
        />
      </div>

    </div>
  );
}