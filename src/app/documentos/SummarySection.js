import SummaryCard from '@/components/shared/SummaryCard'

export default function SummarySection({
  documents = []
}) {

  /*
    CALCULAR CANTIDAD DE DOCUMENTOS
    POR CATEGORÍA
  */

  const categoryTotals = {}

  documents.forEach((document) => {

    document.categorias?.forEach((categoryName) => {

      if (!categoryName) return

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + 1

    })

  })

  /*
    ORDENAR DESCENDENTE
    Y TOMAR SOLO 3
  */

  const topCategories =
    Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

  return (

    <section
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4

        gap-5
      "
    >

      {/* TOTAL DOCUMENTOS */}

      <SummaryCard
        title="Total documentos"
        total={documents.length}
      />

      {/* TOP CATEGORÍAS */}

      {topCategories.map(([category, total]) => (

        <SummaryCard
          key={category}
          title={category}
          total={total}
        />

      ))}

    </section>

  )

}