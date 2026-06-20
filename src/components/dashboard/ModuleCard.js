import Link from 'next/link'

import {
  FileText,
  ClipboardCheck,
  ChartColumn,
  Megaphone,
  HardHat
} from 'lucide-react'

const icons = {
  'file-text': FileText,
  'clipboard-check': ClipboardCheck,
  'chart-column': ChartColumn,
  'megaphone': Megaphone,
  'hard-hat': HardHat,
}

export default function ModuleCard({ module }) {

  const Icon = icons[module.icono]

  if (module.activo) {
    return (
      <Link
        href={module.ruta}
        className="
          group
          bg-white
          border
          border-gray-300
          rounded-2xl
          p-6
          flex
          flex-col
          items-center
          hover:shadow-lg
          hover:-translate-y-1
          transition-all
          duration-300
          cursor-pointer
        "
      >
  
        <div className="
          w-16
          h-16
          rounded-full
          bg-yellow-50
          flex
          items-center
          justify-center
          mb-4
        ">
  
          {Icon && (
            <Icon
              size={30}
              className="
                text-primary
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          )}
  
        </div>
  
        <h2 className="
          text-xl
          font-semibold
          text-gray-900
          text-center
        ">
          {module.nombre}
        </h2>
  
        <p className="
          mt-3
          text-sm
          leading-relaxed
          text-gray-500
          text-left
          w-full
        ">
          {module.descripcion}
        </p>
  
      </Link>
    )
  }

  return (
    <div
      className="
        bg-gray-100
        border
        border-gray-200
        rounded-2xl
        p-6
        flex
        flex-col
        items-center
        cursor-not-allowed
      "
    >

      <div className="
        w-16
        h-16
        rounded-full
        bg-gray-200
        flex
        items-center
        justify-center
        mb-4
      ">

        {Icon && (
          <Icon
            size={30}
            className="
              text-gray-400
            "
          />
        )}

      </div>

      <h2 className="
        text-xl
        font-semibold
        text-gray-500
        text-center
      ">
        {module.nombre}
      </h2>

      <p className="
        mt-3
        text-sm
        leading-relaxed
        text-gray-400
        text-left
        w-full
      ">
        {module.descripcion}
      </p>

    </div>
  )
}