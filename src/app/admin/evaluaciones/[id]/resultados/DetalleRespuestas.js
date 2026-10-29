export default function DetalleRespuestas({ respuestas = [] }) {

  // El número es la posición de la pregunta en la evaluación cuando se presentó
  const falladas = respuestas
    .map((respuesta, index) => ({ ...respuesta, numero: index + 1 }))
    .filter((respuesta) => !respuesta.acierto)

  if (falladas.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Respondió correctamente todas las preguntas.
      </p>
    )
  }

  return (
    <div className="space-y-3">

      <p className="text-xs font-medium text-gray-500 uppercase">
        Preguntas falladas ({falladas.length})
      </p>

      {falladas.map((pregunta) => (
        <div
          key={pregunta.pregunta_id}
          className="bg-white rounded-lg border border-gray-200 p-3 space-y-1"
        >
          <p className="text-sm font-medium text-black">
            {pregunta.numero}. {pregunta.enunciado}
          </p>
          <p className="text-xs text-red-700">
            Respondió: {(pregunta.elegidas || []).join(', ') || '—'}
          </p>
          <p className="text-xs text-green-700">
            Correcta: {(pregunta.correctas || []).join(', ') || '—'}
          </p>
        </div>
      ))}

    </div>
  )

}