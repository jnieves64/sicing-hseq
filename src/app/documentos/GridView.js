import CategorySection from './CategorySection'

export default function GridView({

  documents = []

}) {

  /*
    GROUP DOCUMENTS
    BY CATEGORY
  */

  const groupedDocuments = documents.reduce(
    (accumulator, document) => {
      const categories = document.categorias;

      if (categories && categories.length > 0) {
        categories.forEach((category) => {
          if (!category) return;

          if (!accumulator[category]) {
            accumulator[category] = [];
          }
          accumulator[category].push(document);
        });
      }

      return accumulator;
    },
    {}
  );

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