import LoginHero from "./LoginHero";
import LoginFormCard from "./LoginFormCard";
import LoginNotice from "@/components/auth/LoginNotice";

export default function LoginLayout() {
  return (
    <main className="flex h-screen overflow-hidden">
      <LoginNotice />

      {/* Panel izquierdo */}
      <div className="w-[45%]">
        <LoginHero />
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
        <LoginFormCard />
      </div>
    </main>
  );
}