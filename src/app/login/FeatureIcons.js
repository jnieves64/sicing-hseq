import {
    HardHat,
    ShieldCheck,
    ClipboardCheck,
  } from "lucide-react";
  
  export default function FeatureIcons() {
    return (
      <div className="flex items-center justify-center gap-10">
        <HardHat
          size={40}
          strokeWidth={1.75}
          className="text-gray-500"
        />
  
        <ShieldCheck
          size={40}
          strokeWidth={1.75}
          className="text-gray-500"
        />
  
        <ClipboardCheck
          size={40}
          strokeWidth={1.75}
          className="text-gray-500"
        />
      </div>
    );
  }