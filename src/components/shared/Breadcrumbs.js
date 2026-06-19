import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items = [] }) {

  return (

    <nav
      className="
        flex
        items-center
        flex-wrap
        gap-2
      "
    >

      {items.map((item, index) => {

        const isLast = index === items.length - 1

        return (

          <div
            key={item.label}
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* LINK */}
            {item.href && !isLast ? (

              <Link
                href={item.href}
                className="
                  text-sm
                  text-gray-500
                  hover:text-primary
                  transition-colors
                  duration-200
                "
              >
                {item.label}
              </Link>

            ) : (

              <span
                className="
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                {item.label}
              </span>

            )}

            {/* ARROW */}
            {!isLast && (

              <ChevronRight
                size={16}
                className="text-gray-400"
              />

            )}

          </div>

        )

      })}

    </nav>

  )
}