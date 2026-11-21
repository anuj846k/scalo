import ResetPasswordForm from '@/features/auth/components/reset-password-form';

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  return (
    <div>
      <ResetPasswordForm token={token} error={error} />
    </div>
  );
}
