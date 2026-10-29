import CategorySection from './CategorySection'

export default function GridView({

  evaluaciones = []

}) {

  /*
    AGRUPAR POR CATEGORÍA
    (las evaluaciones sin categoría van en su propia sección)
  */

  const grupos = {}
  const sinCategoria = []

  evaluaciones.forEach((evaluacion) => {

    if (evaluacion.categorias && evaluacion.categorias.length > 0) {

      evaluacion.categorias.forEach((categoria) => {

        if (!categoria) return

        if (!grupos[categoria]) {
          grupos[categoria] = []
        }

        grupos[categoria].push(evaluacion)

      })

    } else {

      sinCategoria.push(evaluacion)

    }

  })

  const entradas = Object.entries(grupos)

  if (sinCategoria.length > 0) {
    entradas.push(['Sin categoría', sinCategoria])
  }

  /*
    ESTADO VACÍO
  */

  if (!entradas.length) {

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

    <section className="w-full flex flex-col gap-10">

      {entradas.map(([categoria, items]) => (
        <CategorySection
          key={categoria}
          title={categoria}
          evaluaciones={items}
        />
      ))}

    </section>

  )

}