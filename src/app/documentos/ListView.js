import DocumentRow from './DocumentRow'

export default function ListView({

  documents = []

}) {

  /*
    EMPTY STATE
  */

  if (!documents.length) {

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

        gap-4
      "
    >

      {documents.map((document) => (

        <DocumentRow

          key={document.id}

          document={document}

        />

      ))}

    </section>

  )

}