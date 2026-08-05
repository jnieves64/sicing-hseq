'use client'

export default function NombreField({
  value,
  onChange,
  disabled = false
}) {

  return (
    <div className="flex flex-col gap-2">

      <label
        htmlFor="nombre"
        className="text-sm font-medium text-black"
      >
        Nombre completo
      </label>

      <input
        id="nombre"
        name="nombre"
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Tu nombre completo"
        autoComplete="name"
        className="
          w-full
          h-12
          px-4
          rounded-lg
          border
          border-gray-400
          bg-gray-100
          text-black
          text-sm
          outline-none
          transition-colors
          focus:border-primary
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      />

    </div>
  )

}