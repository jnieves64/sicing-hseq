import {

    FileText,
    Eye,
    Download
  
  } from 'lucide-react'
  
  export default function DocumentRow({
  
    document
  
  }) {
  
    /*
      DOWNLOAD HANDLER
    */
  
    const handleDownload = () => {
  
      if (!document?.url_archivo) return
  
      /*
        GOOGLE DRIVE DOWNLOAD URL
      */
  
      const fileId =
        document.url_archivo
          .split('/d/')[1]
          ?.split('/')[0]
  
      if (!fileId) {
  
        window.open(
          document.url_archivo,
          '_blank'
        )
  
        return
  
      }
  
      const downloadUrl =
  
        `https://drive.google.com/uc?export=download&id=${fileId}`
  
      window.open(
        downloadUrl,
        '_blank'
      )
  
    }
  
    return (
  
      <article
        className="
          w-full
  
          bg-white
  
          border
          border-gray-300
  
          rounded-2xl
  
          px-4
          py-4
  
          flex
          items-center
          justify-between
  
          gap-4
  
          transition-all
          duration-200
  
          hover:shadow-sm
        "
      >
  
        {/* LEFT */}
  
        <div
          className="
            flex
            items-center
  
            gap-4
  
            min-w-0
          "
        >
  
          {/* ICON */}
  
          <div
            className="
              w-12
              h-12
  
              rounded-xl
  
              bg-primary/10
  
              flex
              items-center
              justify-center
  
              shrink-0
            "
          >
  
            <FileText
              className="
                w-5
                h-5
  
                text-primary
              "
            />
  
          </div>
  
          {/* INFO */}
  
          <div
            className="
              min-w-0
            "
          >
  
            <h3
              className="
                text-base
                font-semibold
  
                text-black
  
                truncate
              "
            >
  
              {document.nombre}
  
            </h3>
  
            <p
              className="
                text-sm
                text-gray-500
  
                mt-1
              "
            >
  
              Versión {document.version}
              {' · '}
              Actualizado {document.fecha}
  
            </p>
  
          </div>
  
        </div>
  
        {/* RIGHT */}
  
        <div
          className="
            flex
            items-center
  
            gap-5
  
            shrink-0
          "
        >
  
          {/* TAGS */}
  
          <div
            className="
              hidden
              md:flex
  
              items-center
  
              gap-2
            "
          >
  
            {document.categorias?.map((category) => (
  
              <span
  
                key={category}
  
                className="
                  px-3
                  py-1
  
                  rounded-lg
  
                  text-xs
                  font-medium
  
                  bg-primary/10
                  text-primary
                "
              >
  
                {category}
  
              </span>
  
            ))}
  
          </div>
  
          {/* ACTIONS */}
  
          <div
            className="
              flex
              items-center
  
              gap-2
            "
          >
  
            {/* VIEW */}
  
            <a
              href={document.url_archivo}
              target="_blank"
              rel="noopener noreferrer"
  
              className="
                w-10
                h-10
  
                rounded-xl
  
                border
                border-gray-300
  
                flex
                items-center
                justify-center
  
                text-gray-700
  
                transition-all
                duration-200
  
                hover:bg-primary/10
                hover:text-primary
  
                cursor-pointer
              "
            >
  
              <Eye
                className="
                  w-4
                  h-4
                "
              />
  
            </a>
  
            {/* DOWNLOAD */}
  
            <button
              onClick={handleDownload}
  
              className="
                w-10
                h-10
  
                rounded-xl
  
                border
                border-gray-300
  
                flex
                items-center
                justify-center
  
                text-gray-700
  
                transition-all
                duration-200
  
                hover:bg-primary
                hover:text-white
  
                cursor-pointer
              "
            >
  
              <Download
                className="
                  w-4
                  h-4
                "
              />
  
            </button>
  
          </div>
  
        </div>
  
      </article>
  
    )
  
  }