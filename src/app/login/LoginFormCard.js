import LoginForm from "./LoginForm";

export default function LoginFormCard() {
  return (
    <div
      className="
        w-full
        max-w-lg
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-8
      "
    >
      <LoginForm />
    </div>
  );
}