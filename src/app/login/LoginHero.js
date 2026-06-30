import PortalLogo from "./PortalLogo";
import PortalTitle from "./PortalTitle";
import PortalDescription from "./PortalDescription";
import FeatureIcons from "./FeatureIcons";

export default function LoginHero() {
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

      <PortalTitle />

      <PortalDescription />

      <FeatureIcons />
    </section>
  );
}