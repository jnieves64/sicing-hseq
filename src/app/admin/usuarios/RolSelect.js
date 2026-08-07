'use client'

export default function RolSelect({ roles = [], value, onChange, disabled }) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 disabled:opacity-60"
    >
      <option value="">Sin rol</option>
      {roles.map((rol) => (
        <option key={rol.id} value={rol.id}>
          {rol.nombre}
        </option>
      ))}
    </select>
  );
}