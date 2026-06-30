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
        className="h-auto w-auto"
      />
    </div>
  );
}