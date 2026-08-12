import {
    HardHat,
    ShieldCheck,
    ClipboardCheck,
  } from "lucide-react";
  
  export default function FeatureIcons() {
    return (
      <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
        <HardHat
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-500"
          strokeWidth={1.75}
        />
  
        <ShieldCheck
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-500"
          strokeWidth={1.75}
        />
  
        <ClipboardCheck
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-500"
          strokeWidth={1.75}
        />
      </div>
    );
  }