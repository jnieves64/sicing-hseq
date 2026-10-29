import Link from 'next/link'
import { ClipboardCheck } from 'lucide-react'

import EstadoBadge, { accionEvaluacion } from './EstadoEvaluacion'

export default function EvaluacionCard({ evaluacion }) {

  const accion = accionEvaluacion(evaluacion.estado)

  const meta = [
    evaluacion.codigo,
    `${evaluacion.total_preguntas} pregunta${evaluacion.total_preguntas === 1 ? '' : 's'}`
  ].filter(Boolean).join(' • ')

  return (

    <article
      className="
        bg-white

        border
        border-gray-300

        rounded-2xl

        p-5

        flex
        flex-col

        justify-between

        gap-5

        transition-all
        duration-200

        hover:shadow-md
      "
    >

      {/* TOP SECTION */}

      <div className="flex items-start gap-4">

        {/* ICON */}

        <div
          className="
            min-w-12
            h-12

            rounded-2xl

            bg-primary/10

            flex
            items-center
            justify-center
          "
        >
          <ClipboardCheck size={22} className="text-primary" />
        </div>

        {/* CONTENT */}

        <div className="flex flex-col gap-2 min-w-0">

          {/* TAGS Y ESTADO */}

          <div className="flex flex-wrap gap-2">

            {evaluacion.categorias?.map((category) => (
              <span
                key={category}
                className="
                  px-2.5
                  py-1

                  rounded-md

                  bg-primary/10

                  text-primary

                  text-xs
                  font-medium
                "
              >
                {category}
              </span>
            ))}

            <EstadoBadge estado={evaluacion.estado} />

          </div>

          {/* TITLE */}

          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {evaluacion.titulo}
          </h3>

          {/* DESCRIPTION */}

          {evaluacion.descripcion && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {evaluacion.descripcion}
            </p>
          )}

          {/* META */}

          <p className="text-sm text-gray-500">
            {meta}
          </p>

        </div>

      </div>

      {/* DIVIDER */}

      <div className="border-t border-gray-200" />

      {/* ACTION */}

      <Link
        href={`/evaluaciones/${evaluacion.id}`}
        className={`
          h-11

          rounded-xl

          flex
          items-center
          justify-center

          text-sm
          font-medium

          transition-all
          duration-200

          ${accion.principal
            ? 'bg-primary text-white hover:opacity-90'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
          }
        `}
      >
        {accion.label}
      </Link>

    </article>

  )

}