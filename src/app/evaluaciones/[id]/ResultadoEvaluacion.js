import Link from 'next/link'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ResultadoEvaluacion({ resultado, minimo, onReintentar }) {

  const aprobado = resultado.aprobado
  const maximo = resultado.puntaje_maximo
  const minimoReal = minimo ?? maximo

  const fecha = resultado.fecha
    ? new Date(resultado.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : null

  const mensajeAprobado = resultado.puntaje === maximo
    ? 'Respondiste correctamente todas las preguntas.'
    : `Alcanzaste el mínimo requerido para aprobar: ${minimoReal} de ${maximo} respuestas correctas.`

  const requisito = minimoReal >= maximo
    ? 'todas las preguntas'
    : `al menos ${minimoReal} de ${maximo} preguntas`

  return (

    <section
      className={`
        rounded-2xl

        border

        p-8

        space-y-5

        ${aprobado
          ? 'bg-green-50 border-green-200'
          : 'bg-amber-50 border-amber-200'
        }
      `}
    >

      <div className="flex items-center gap-4">

        {aprobado
          ? <CheckCircle2 className="w-10 h-10 text-green-600 shrink-0" />
          : <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
        }

        <div>

          <h2
            className={`text-xl font-semibold ${aprobado ? 'text-green-800' : 'text-amber-900'}`}
          >
            {aprobado ? 'Evaluación aprobada' : 'Requiere refuerzo'}
          </h2>

          <p className="text-sm text-gray-700 mt-1">
            {resultado.puntaje} de {maximo} respuestas correctas
            {fecha && ` · Presentada el ${fecha}`}
          </p>

        </div>

      </div>

      <p className="text-sm text-gray-700">
        {aprobado
          ? mensajeAprobado
          : `Para aprobar debes responder correctamente ${requisito}. Comunícate con tu responsable para recibir el refuerzo; un administrador podrá habilitarte un nuevo intento.`
        }
      </p>

      {resultado.vistaPrevia && (
        <p className="text-sm font-medium text-amber-800">
          Vista previa: este resultado no se guardó.
        </p>
      )}

      <div className="flex flex-wrap gap-3">

        <Link
          href="/evaluaciones"
          className="
            h-11

            px-6

            rounded-xl

            border
            border-gray-300

            bg-white

            flex
            items-center
            justify-center

            text-sm
            font-medium
            text-gray-700

            hover:bg-gray-100
          "
        >
          Volver a evaluaciones
        </Link>

        {onReintentar && (
          <button
            type="button"
            onClick={onReintentar}
            className="
              h-11

              px-6

              rounded-xl

              bg-primary

              text-sm
              font-medium
              text-white

              hover:opacity-90
            "
          >
            Probar de nuevo
          </button>
        )}

      </div>

    </section>

  )

}