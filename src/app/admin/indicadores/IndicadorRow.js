import AccionesCell from './AccionesCell'
import { formatearFecha, etiquetasDeGraficas } from '@/lib/indicadoresHelpers'

const ESTADO_STYLES = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-gray-100 text-gray-500',
}

export default function IndicadorRow({ indicador, onToggleActivo, onEliminar }) {

  const etiquetas = etiquetasDeGraficas(indicador.graficas)

  return (
    <tr className="border-b border-gray-100">

      <td className="py-3 px-4 max-w-sm">
        <p className="text-sm font-medium text-black">{indicador.titulo}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{indicador.descripcion}</p>
      </td>

      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 max-w-[220px]">
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
      </td>

      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
        {formatearFecha(indicador.updated_at)}
      </td>

      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ESTADO_STYLES[indicador.activo]}`}>
          {indicador.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="py-3 px-4">
        <AccionesCell
          indicadorId={indicador.id}
          activo={indicador.activo}
          onToggleActivo={() => onToggleActivo(indicador.id, !indicador.activo)}
          onEliminar={() => onEliminar(indicador.id)}
        />
      </td>

    </tr>
  );
}