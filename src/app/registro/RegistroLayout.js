import RegistroHero from "./RegistroHero";
import RegistroFormCard from "./RegistroFormCard/RegistroFormCard";

export default function RegistroLayout() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden">

      {/* Panel izquierdo */}
      <div className="w-full md:w-[45%] shrink-0">
        <RegistroHero />
      </div>

      {/* Panel derecho */}
      <div
        className="
          w-full
          md:w-[55%]
          flex
          items-center
          justify-center
          bg-gray-100
          px-6
          sm:px-8
          py-10
          md:py-0
        "
      >
        <RegistroFormCard />
      </div>

    </main>
  );
}