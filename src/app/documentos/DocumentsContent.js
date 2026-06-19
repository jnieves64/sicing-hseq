import GridView from './GridView'
import ListView from './ListView'

export default function DocumentsContent({

  documents = [],
  viewMode = 'grid'

}) {

  const totalDocuments = documents.length;

  return (

    <section
      className="
        w-full

        flex
        flex-col

        gap-6
      "
    >

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

        {totalDocuments}
        {' '}
        documento
        {totalDocuments !== 1 && 's'}

      </div>

      {/* CONTENT */}

      {viewMode === 'grid' ? (

        <GridView
          documents={documents}
        />

      ) : (

        <ListView

          documents={documents}

        />

      )}

    </section>

  )

}