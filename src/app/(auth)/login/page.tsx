import AuthLayout from "@/features/auth/components/auth-layout";
import LoginForm from "@/features/auth/components/login-form.tsx/login-form";

export default function Login() {
  return (
    <AuthLayout imageSrc="/auth/image.png">
      <LoginForm />
    </AuthLayout>
  );
}