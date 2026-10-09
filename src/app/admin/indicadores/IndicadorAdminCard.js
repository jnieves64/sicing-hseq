import AccionesCell from './AccionesCell'
import { formatearFecha, etiquetasDeGraficas } from '@/lib/indicadoresHelpers'

const ESTADO_STYLES = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-gray-100 text-gray-500',
}

export default function IndicadorAdminCard({ indicador, onToggleActivo, onEliminar }) {

  const etiquetas = etiquetasDeGraficas(indicador.graficas)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-black">{indicador.titulo}</p>
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{indicador.descripcion}</p>
        </div>

        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${ESTADO_STYLES[indicador.activo]}`}>
          {indicador.activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {etiquetas.length > 0 ? (
          etiquetas.map((etiqueta) => (
            <span
              key={etiqueta}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
            >
              {etiqueta}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">Sin gráficas</span>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Actualizado el {formatearFecha(indicador.updated_at)}
      </p>

      <div className="pt-2 border-t border-gray-100">
        <AccionesCell
          indicadorId={indicador.id}
          activo={indicador.activo}
          onToggleActivo={() => onToggleActivo(indicador.id, !indicador.activo)}
          onEliminar={() => onEliminar(indicador.id)}
        />
      </div>

    </div>
  );
}