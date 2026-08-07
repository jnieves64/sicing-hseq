'use client'

export default function CargoSelect({ cargos = [], value, onChange, disabled }) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 disabled:opacity-60"
    >
      <option value="">Sin cargo</option>
      {cargos.map((cargo) => (
        <option key={cargo.id} value={cargo.id}>
          {cargo.nombre}
        </option>
      ))}
    </select>
  );
}