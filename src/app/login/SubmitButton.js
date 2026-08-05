export default function SubmitButton({
  loading = false,
  label = "Iniciar sesión",
  loadingLabel = "Iniciando sesión...",
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full
        min-w-[180px]
        px-8
        py-4
        rounded-lg
        font-medium
        text-sm
        transition-all
        duration-200
        ${
          loading
            ? "bg-[#ebbb18]/70 cursor-not-allowed"
            : "bg-[#ebbb18] hover:brightness-95 active:scale-[0.98] cursor-pointer"
        }
        text-black
      `}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}