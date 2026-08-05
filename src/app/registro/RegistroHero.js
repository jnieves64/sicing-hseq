import PortalLogo from "../login/PortalLogo";
import FeatureIcons from "../login/FeatureIcons";

export default function RegistroHero() {
  return (
    <section
      className="
        flex
        flex-col
        items-center
        justify-center
        gap-6
        h-full
        px-10
        bg-[#272725]
      "
    >
      <PortalLogo />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Únete al Portal SIG
        </h1>
        <p className="text-sm text-gray-300 max-w-xs">
          Crea tu solicitud de acceso. Un administrador la revisará y aprobará tu registro.
        </p>
      </div>

      <FeatureIcons />
    </section>
  );
}