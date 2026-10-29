import PresentarEvaluacionView from "./PresentarEvaluacionView";
import AuthGuard from "@/components/auth/AuthGuard";

export default function PresentarEvaluacionPage() {
  return (
    <AuthGuard ruta="/evaluaciones">
      <PresentarEvaluacionView />
    </AuthGuard>
  );
}