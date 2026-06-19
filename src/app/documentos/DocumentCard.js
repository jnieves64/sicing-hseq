import {

    FileText,
    Eye,
    Download
  
  } from 'lucide-react'
  
  export default function DocumentCard({ document }) {
  
    /*
      OPEN DOCUMENT
    */
  
    const handleView = () => {
  
      window.open(
        document.url_archivo,
        '_blank'
      )
  
    }
  
    /*
      DOWNLOAD DOCUMENT
    */
  
    const handleDownload = () => {
  
      /*
        GOOGLE DRIVE DIRECT DOWNLOAD
      */
  
      const fileId =
        document.url_archivo.match(/[-\w]{25,}/)
  
      if (!fileId) return
  
      const downloadUrl =
        `https://drive.google.com/uc?export=download&id=${fileId[0]}`
  
      window.open(downloadUrl, '_blank')
  
    }
  
    return (
  
      <article
        className="
          bg-white
  
          border
          border-gray-300
  
          rounded-2xl
  
          p-5
  
          flex
          flex-col
  
          justify-between
  
          gap-5
  
          transition-all
          duration-200
  
          hover:shadow-md
        "
      >
  
        {/* TOP SECTION */}
  
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
  
          {/* ICON */}
  
          <div
            className="
              min-w-12
              h-12
  
              rounded-2xl
  
              bg-primary/10
  
              flex
              items-center
              justify-center
            "
          >
  
            <FileText
              size={22}
              className="text-primary"
            />
  
          </div>
  
          {/* CONTENT */}
  
          <div
            className="
              flex
              flex-col
  
              gap-2
  
              min-w-0
            "
          >
  
            {/* TAGS */}
  
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
  
              {document.categorias?.map((category) => (
  
                <span
  
                  key={category}
  
                  className="
                    px-2.5
                    py-1
  
                    rounded-md
  
                    bg-primary/10
  
                    text-primary
  
                    text-xs
                    font-medium
                  "
                >
  
                  {category}
  
                </span>
  
              ))}
  
            </div>
  
            {/* TITLE */}
  
            <h3
              className="
                text-lg
                font-semibold
                text-gray-900
  
                leading-snug
              "
            >
  
              {document.nombre}
  
            </h3>
  
            {/* META */}
  
            <p
              className="
                text-sm
                text-gray-500
              "
            >
  
              Versión {document.version}
              {' • '}
              Actualizado {document.fecha}
  
            </p>
  
          </div>
  
        </div>
  
        {/* DIVIDER */}
  
        <div
          className="
            border-t
            border-gray-200
          "
        />
  
        {/* ACTIONS */}
  
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
  
          {/* VIEW BUTTON */}
  
          <button
  
            type="button"
  
            onClick={handleView}
  
            className="
              flex-1
  
              h-11
  
              rounded-xl
  
              border
              border-gray-300
  
              bg-white
  
              flex
              items-center
              justify-center
              gap-2
  
              text-sm
              font-medium
              text-gray-700
  
              transition-all
              duration-200
  
              hover:bg-gray-100
              hover:cursor-pointer
            "
          >
  
            <Eye size={18} />
  
            Ver
  
          </button>
  
          {/* DOWNLOAD BUTTON */}
  
          <button
  
            type="button"
  
            onClick={handleDownload}
  
            className="
              flex-1
  
              h-11
  
              rounded-xl
  
              bg-primary
  
              flex
              items-center
              justify-center
              gap-2
  
              text-sm
              font-medium
              text-white
  
              transition-all
              duration-200
  
              hover:opacity-90
              hover:cursor-pointer
            "
          >
  
            <Download size={18} />
  
            Descargar
  
          </button>
  
        </div>
  
      </article>
  
    )
  
  }