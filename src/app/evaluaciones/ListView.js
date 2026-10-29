import EvaluacionRow from './EvaluacionRow'

export default function ListView({

  evaluaciones = []

}) {

  if (!evaluaciones.length) {

    return (

      <div
        className="
          w-full

          bg-white

          border
          border-gray-300

          rounded-2xl

          py-20

          flex
          items-center
          justify-center
        "
      >
        <p className="text-sm text-gray-500">
          No se encontraron evaluaciones.
        </p>
      </div>

    )

  }

  return (

    <section className="w-full flex flex-col gap-4">

      {evaluaciones.map((evaluacion) => (
        <EvaluacionRow
          key={evaluacion.id}
          evaluacion={evaluacion}
        />
      ))}

    </section>

  )

}