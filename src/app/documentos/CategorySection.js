import DocumentCard from './DocumentCard'

export default function CategorySection({

  title,
  documents = []

}) {

  /*
    HIDE EMPTY SECTIONS
  */

  if (!documents.length) return null

  return (

    <section
      className="
        flex
        flex-col

        gap-5
      "
    >

      {/* CATEGORY TITLE */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <div
          className="
            w-2
            h-2

            rounded-full

            bg-primary
          "
        />

        <h2
          className="
            text-base
            font-semibold
            uppercase

            tracking-wide

            text-gray-700
          "
        >

          {title}

        </h2>

      </div>

      {/* GRID */}

      <div
        className="
          grid

          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3

          gap-6
        "
      >

        {documents.map((document) => (

          <DocumentCard

            key={document.id}

            document={document}

          />

        ))}

      </div>

    </section>

  )

}