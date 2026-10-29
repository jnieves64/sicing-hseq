const ESTADOS = {
  pendiente: { label: 'Pendiente', estilos: 'bg-gray-100 text-gray-600' },
  aprobada: { label: 'Aprobada', estilos: 'bg-green-100 text-green-700' },
  refuerzo: { label: 'Requiere refuerzo', estilos: 'bg-amber-100 text-amber-800' },
}

// Etiqueta de estado. Los administradores no tienen estado (null): no se dibuja nada.
export default function EstadoBadge({ estado }) {

  const config = ESTADOS[estado]

  if (!config) return null

  return (
    <span
      className={`
        px-2.5
        py-1

        rounded-md

        text-xs
        font-medium

        whitespace-nowrap

        ${config.estilos}
      `}
    >
      {config.label}
    </span>
  )

}

// Texto y estilo del botón según el estado
export function accionEvaluacion(estado) {

  if (estado === 'pendiente') {
    return { label: 'Presentar', principal: true }
  }

  if (estado === 'aprobada' || estado === 'refuerzo') {
    return { label: 'Ver resultado', principal: false }
  }

  // Administrador
  return { label: 'Vista previa', principal: false }

}