import RegistroHero from "./RegistroHero";
import RegistroFormCard from "./RegistroFormCard/RegistroFormCard";

export default function RegistroLayout() {
  return (
    <main className="flex h-screen overflow-hidden">

      {/* Panel izquierdo */}
      <div className="w-[45%]">
        <RegistroHero />
      </div>

      {/* Panel derecho */}
      <div
        className="
          w-[55%]
          flex
          items-center
          justify-center
          bg-gray-100
          px-8
        "
      >
        <RegistroFormCard />
      </div>

    </main>
  );
}