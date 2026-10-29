import GridView from './GridView'
import ListView from './ListView'

export default function EvaluacionesContent({

  evaluaciones = [],
  viewMode = 'grid'

}) {

  const total = evaluaciones.length

  return (

    <section className="w-full flex flex-col gap-6">

      {/* TOTAL */}

      <div
        className="
          inline-flex
          items-center

          w-fit

          px-3
          py-1

          rounded-lg

          bg-gray-200

          text-sm
          font-medium
          text-gray-700
        "
      >
        {total} {total === 1 ? 'evaluación' : 'evaluaciones'}
      </div>

      {/* CONTENT */}

      {viewMode === 'grid' ? (
        <GridView evaluaciones={evaluaciones} />
      ) : (
        <ListView evaluaciones={evaluaciones} />
      )}

    </section>

  )

}