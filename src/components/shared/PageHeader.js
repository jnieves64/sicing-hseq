export default function PageHeader({
    title,
    description
  }) {
  
    return (
  
      <section
        className="
          flex
          flex-col
          gap-2
        "
      >
  
        {/* TITLE */}
        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          {title}
        </h1>
  
        {/* DESCRIPTION */}
        <p
          className="
            max-w-3xl
            text-base
            leading-relaxed
            text-gray-500
          "
        >
          {description}
        </p>
  
      </section>
  
    )
  }