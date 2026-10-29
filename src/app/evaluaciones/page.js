import EvaluacionesPageView from "./EvaluacionesPageView";
import AuthGuard from "@/components/auth/AuthGuard";

export default function EvaluacionesPage() {
  return (
    <AuthGuard ruta="/evaluaciones">
      <EvaluacionesPageView />
    </AuthGuard>
  );
}