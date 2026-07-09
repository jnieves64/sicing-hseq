import { Suspense } from "react";
import LoginLayout from "./LoginLayout";
import GuestGuard from "@/components/auth/GuestGuard";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <GuestGuard>
        <LoginLayout />
      </GuestGuard>
    </Suspense>
  );
}