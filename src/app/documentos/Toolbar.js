import FilterBar from './FilterBar'
import ViewToggle from './ViewToggle'

export default function Toolbar({

  categories = [],

  selectedCategory,
  setSelectedCategory,

  viewMode,
  setViewMode

}) {

  return (

    <section
      className="
        w-full

        flex
        flex-col
        md:flex-row

        md:items-center
        md:justify-between

        gap-4
      "
    >

      {/* FILTER BAR */}

      <FilterBar

        categories={categories}

        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}

      />

      {/* VIEW TOGGLE */}

      <ViewToggle

        viewMode={viewMode}
        setViewMode={setViewMode}

      />

    </section>

  )

}