import Image from "next/image";

export default function PortalLogo() {
  return (
    <div className="flex justify-center">
      <Image
        src="/Icono.png"
        alt="Logo SICING"
        width={140}
        height={140}
        priority
        className="h-20 w-20 sm:h-28 sm:w-28 md:h-[140px] md:w-[140px]"
      />
    </div>
  );
}