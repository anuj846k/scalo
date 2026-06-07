import AuthLayout from "@/features/auth/components/auth-layout";
import RegisterForm from "@/features/auth/components/register-form";

export default function SignUp() {
  return (
    <AuthLayout imageSrc="/auth/signup.png">
      <RegisterForm />
    </AuthLayout>
  );
}