'use client'

export default function EmailField({
  value,
  onChange,
  disabled = false
}) {

  return (
    <div className="flex flex-col gap-2">

      <label
        htmlFor="email"
        className="text-sm font-medium text-black"
      >
        Usuario o correo
      </label>

      <input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="nombre@empresa.com"
        autoComplete="email"
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