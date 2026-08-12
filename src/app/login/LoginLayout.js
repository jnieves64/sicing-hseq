import LoginHero from "./LoginHero";
import LoginFormCard from "./LoginFormCard";
import LoginNotice from "@/components/auth/LoginNotice";

export default function LoginLayout() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden">
      <LoginNotice />

      {/* Panel izquierdo */}
      <div className="w-full md:w-[45%] shrink-0">
        <LoginHero />
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
        <LoginFormCard />
      </div>

    </main>
  );
}