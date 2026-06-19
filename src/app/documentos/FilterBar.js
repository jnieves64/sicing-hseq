export default function FilterBar({

    categories = [],
  
    selectedCategory,
    setSelectedCategory
  
  }) {
  
    return (
  
      <div
        className="
          flex
          items-center
        "
      >
  
        <select
  
          value={selectedCategory}
  
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
  
          className="
            h-11
  
            min-w-[240px]
  
            px-4
  
            rounded-xl
  
            border
            border-gray-300
  
            bg-white
  
            text-sm
            text-gray-900
  
            outline-none
  
            transition-all
            duration-200
  
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
          "
        >
  
          {/* DEFAULT OPTION */}
  
          <option value="all">
            Todas las categorías
          </option>
  
          {/* DYNAMIC OPTIONS */}
  
          {categories.map((category) => (
  
            <option
              key={category.id}
              value={category.nombre}
            >
              {category.nombre}
            </option>
  
          ))}
  
        </select>
  
      </div>
  
    )
  
  }