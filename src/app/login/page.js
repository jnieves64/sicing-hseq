import LoginLayout from "./LoginLayout";
import GuestGuard from "@/components/auth/GuestGuard";

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginLayout />
    </GuestGuard>
  );
}