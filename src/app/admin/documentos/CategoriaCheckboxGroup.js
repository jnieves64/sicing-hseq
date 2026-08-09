'use client'

export default function CategoriaCheckboxGroup({ categorias = [], selected = [], onChange }) {

    const toggle = (categoriaId) => {

        if (selected.includes(categoriaId)) {
            onChange(selected.filter((id) => id !== categoriaId))
        } else {
            onChange([...selected, categoriaId])
        }

    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {categorias.map((categoria) => {

                const checked = selected.includes(categoria.id)

                return (
                    <label
                        key={categoria.id}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer
                            ${checked ? 'border-[#ebbb18] bg-[#ebbb18]/10' : 'border-gray-200 bg-white'}
                        `}
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(categoria.id)}
                            className="w-4 h-4 rounded accent-[#ebbb18]"
                        />
                        <span className="text-sm text-gray-800">{categoria.nombre}</span>
                    </label>
                )

            })}
        </div>
    )

}