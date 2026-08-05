import RegistroForm from "./RegistroForm";

export default function RegistroFormCard() {
  return (
    <div
      className="
        w-full
        max-w-lg
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-8
      "
    >
      <RegistroForm />
    </div>
  );
}