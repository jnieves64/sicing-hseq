'use client'

export default function PreguntaPresentar({
  pregunta,
  numero,
  seleccionada,
  onSeleccionar,
  disabled
}) {

  const nombre = `pregunta-${pregunta.id}`
  const esVF = pregunta.tipo === 'verdadero_falso'

  return (

    <div
      role="radiogroup"
      aria-labelledby={`${nombre}-enunciado`}
      className="
        bg-white

        border
        border-gray-300

        rounded-2xl

        p-5

        space-y-4
      "
    >

      <div className="flex items-start gap-3">

        <span
          className="
            min-w-8
            h-8

            rounded-lg

            bg-primary/10

            flex
            items-center
            justify-center

            text-sm
            font-semibold
            text-primary
          "
        >
          {numero}
        </span>

        <p
          id={`${nombre}-enunciado`}
          className="text-base font-medium text-gray-900 leading-snug pt-1"
        >
          {pregunta.enunciado}
        </p>

      </div>

      <div
        className={
          esVF
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            : 'flex flex-col gap-3'
        }
      >

        {pregunta.opciones.map((opcion) => {

          const marcada = seleccionada === opcion.id

          return (

            <label
              key={opcion.id}
              className={`
                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-xl

                border

                cursor-pointer

                transition-all
                duration-200

                ${marcada
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
                }

                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >

              <input
                type="radio"
                name={nombre}
                checked={marcada}
                onChange={() => onSeleccionar(opcion.id)}
                disabled={disabled}
                className="w-4 h-4 accent-[#ebbb18] shrink-0"
              />

              <span className="text-sm text-gray-800">
                {opcion.texto}
              </span>

            </label>

          )

        })}

      </div>

    </div>

  )

}