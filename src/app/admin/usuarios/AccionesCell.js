'use client'

export default function AccionesCell({
  estado,
  dirty,
  disabled,
  onGuardar,
  onRechazar,
}) {
  return (
    <div className="flex items-center gap-2 justify-end">

      {(dirty || estado === 'pendiente') && (
        <button
          onClick={onGuardar}
          disabled={disabled}
          className="
            text-xs font-medium px-3 py-1.5 rounded-lg
            bg-[#ebbb18] hover:brightness-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100
          "
        >
          {estado === 'pendiente' ? 'Aprobar' : 'Guardar'}
        </button>
      )}

      <button
        onClick={onRechazar}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
      >
        Rechazar
      </button>

    </div>
  );
}