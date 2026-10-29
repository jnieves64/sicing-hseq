import Link from 'next/link'
import { ClipboardCheck } from 'lucide-react'

import EstadoBadge, { accionEvaluacion } from './EstadoEvaluacion'

export default function EvaluacionRow({ evaluacion }) {

  const accion = accionEvaluacion(evaluacion.estado)

  const meta = [
    evaluacion.codigo,
    `${evaluacion.total_preguntas} pregunta${evaluacion.total_preguntas === 1 ? '' : 's'}`
  ].filter(Boolean).join(' · ')

  return (

    <article
      className="
        w-full

        bg-white

        border
        border-gray-300

        rounded-2xl

        px-4
        py-4

        flex
        items-center
        justify-between

        gap-4

        transition-all
        duration-200

        hover:shadow-sm
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-4 min-w-0">

        {/* ICON */}

        <div
          className="
            w-12
            h-12

            rounded-xl

            bg-primary/10

            flex
            items-center
            justify-center

            shrink-0
          "
        >
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>

        {/* INFO */}

        <div className="min-w-0">

          <h3 className="text-base font-semibold text-black truncate">
            {evaluacion.titulo}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {meta}
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5 shrink-0">

        {/* TAGS */}

        <div className="hidden md:flex items-center gap-2">

          {evaluacion.categorias?.map((category) => (
            <span
              key={category}
              className="
                px-3
                py-1

                rounded-lg

                text-xs
                font-medium

                bg-primary/10
                text-primary
              "
            >
              {category}
            </span>
          ))}

        </div>

        {/* ESTADO */}

        <EstadoBadge estado={evaluacion.estado} />

        {/* ACTION */}

        <Link
          href={`/evaluaciones/${evaluacion.id}`}
          className={`
            h-10

            px-4

            rounded-xl

            flex
            items-center
            justify-center

            text-sm
            font-medium

            whitespace-nowrap

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

      </div>

    </article>

  )

}