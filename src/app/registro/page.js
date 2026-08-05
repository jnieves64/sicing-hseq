import { Suspense } from "react";
import RegistroLayout from "./RegistroLayout";
import GuestGuard from "@/components/auth/GuestGuard";

export default function RegistroPage() {
  return (
    <Suspense fallback={null}>
      <GuestGuard>
        <RegistroLayout />
      </GuestGuard>
    </Suspense>
  );
}