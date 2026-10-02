import CampanasPageView from "./CampanasPageView";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CampanasPage() {
  return (
    <AuthGuard ruta="/campanas">
      <CampanasPageView />
    </AuthGuard>
  );
}