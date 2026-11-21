'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

// Better Auth's default minimum password length is 8.
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token?: string;
  error?: string;
};

export default function ResetPasswordForm({
  token,
  error,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) return;
    await authClient.resetPassword(
      { newPassword: values.password, token },
      {
        onSuccess: () => router.push('/login'),
        onError: (ctx) => {
          alert(ctx.error.message || 'Could not reset the password.');
        },
      },
    );
  };

  if (!token || error) {
    return (
      <>
        <h2 className="mb-2 text-2xl font-medium tracking-tight">
          Link is not valid
        </h2>
        <p className="text-sm text-ink/70">
          This reset link is invalid or has expired.
        </p>
        <p className="mt-4 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-ink font-semibold hover:underline"
          >
            Request a new link
          </Link>
        </p>
      </>
    );
  }

  const isPending = form.formState.isSubmitting;

  return (
    <>
      <h2 className="mb-4 text-2xl font-medium tracking-tight">
        Choose a new password
      </h2>

      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          {(['password', 'confirmPassword'] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`reset-${name}`}>
                    {name === 'password' ? 'New password' : 'Confirm password'}
                  </FieldLabel>
                  <Input
                    id={`reset-${name}`}
                    type="password"
                    autoComplete="new-password"
                    className="h-10 px-3 bg-canvas text-sm"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 mt-1 rounded-xl text-base font-semibold"
        >
          {isPending ? 'Saving...' : 'Reset password'}
        </Button>
      </form>
    </>
  );
}
