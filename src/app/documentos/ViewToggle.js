import {
    LayoutGrid,
    List
  } from 'lucide-react'
  
  export default function ViewToggle({
  
    viewMode,
    setViewMode
  
  }) {
  
    return (
  
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
  
        {/* GRID BUTTON */}
  
        <button
  
          type="button"
  
          onClick={() =>
            setViewMode('grid')
          }
  
          className={`
            w-11
            h-11
  
            rounded-xl
  
            flex
            items-center
            justify-center
  
            transition-all
            duration-200
  
            ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black hover:bg-primary/10'
            }
          `}
        >
  
          <LayoutGrid size={20} />
  
        </button>
  
        {/* LIST BUTTON */}
  
        <button
  
          type="button"
  
          onClick={() =>
            setViewMode('list')
          }
  
          className={`
            w-11
            h-11
  
            rounded-xl
  
            flex
            items-center
            justify-center
  
            transition-all
            duration-200
  
            ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black hover:bg-primary/10'
            }
          `}
        >
  
          <List size={20} />
  
        </button>
  
      </div>
  
    )
  
  }