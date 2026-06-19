import CategorySection from './CategorySection'

export default function GridView({

  documents = []

}) {

  /*
    VALID DOCUMENTS
  */

  const validDocuments =

    documents.filter((document) =>

      Array.isArray(
        document.categorias
      ) &&

      document.categorias.length > 0

    )

  /*
    GROUP DOCUMENTS
    BY CATEGORY
  */

  const groupedDocuments =

    validDocuments.reduce(

      (
        accumulator,
        document
      ) => {

        document.categorias.forEach(

          (category) => {

            /*
              SKIP EMPTY
            */

            if (!category) return

            /*
              CREATE CATEGORY
            */

            if (
              !accumulator[category]
            ) {

              accumulator[category] = []

            }

            /*
              PUSH DOCUMENT
            */

            accumulator[category].push(
              document
            )

          }

        )

        return accumulator

      },

      {}

    )

  /*
    CONVERT TO ARRAY
  */

  const categoryEntries =

    Object.entries(
      groupedDocuments
    )

  /*
    EMPTY STATE
  */

  if (!categoryEntries.length) {

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

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          No se encontraron documentos.

        </p>

      </div>

    )

  }

  return (

    <section
      className="
        w-full

        flex
        flex-col

        gap-10
      "
    >

      {categoryEntries.map(

        ([category, docs]) => (

          <CategorySection

            key={category}

            title={category}

            documents={docs}

          />

        )

      )}

    </section>

  )

}