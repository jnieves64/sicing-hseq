import DocumentosPageView from "./DocumentosPageView";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DocumentosPage() {
  return (
    <AuthGuard ruta="/documentos">
      <DocumentosPageView />
    </AuthGuard>
  );
}