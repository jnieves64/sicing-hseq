import { Folder } from 'lucide-react'

export default function SummaryCard({
  title,
  total
}) {

  return (

    <div
      className="
        h-[82px]
        bg-white
        border
        border-gray-300
        rounded-2xl

        px-5
        py-4

        flex
        items-center
        gap-4
      "
    >

      {/* ICON */}
      <div
        className="
          w-12
          h-12

          rounded-full

          bg-primary/10

          flex
          items-center
          justify-center

          flex-shrink-0
        "
      >

        <Folder
          size={24}
          className="text-primary"
        />

      </div>

      {/* CONTENT */}
      <div
        className="
          flex
          flex-col
          items-start
          justify-center
        "
      >

        {/* TOTAL */}
        <span
          className="
            text-2xl
            font-bold
            leading-none
            text-gray-900
          "
        >
          {total}
        </span>

        {/* LABEL */}
        <span
          className="
            mt-1

            text-sm
            text-gray-500
          "
        >
          {title}
        </span>

      </div>

    </div>

  )

}