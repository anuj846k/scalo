'use client';

import { useState } from 'react';
import Link from 'next/link';
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

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    await authClient.requestPasswordReset(
      { email: values.email, redirectTo: '/reset-password' },
      {
        onSuccess: () => setSent(true),
        onError: (ctx) => {
          alert(ctx.error.message || 'Could not send the reset email.');
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-medium tracking-tight">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      {sent ? (
        <p className="text-sm text-ink/80">
          If an account exists for that email, a reset link is on its way.
          Check your inbox.
        </p>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="forgot-email">Email address</FieldLabel>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-10 px-3 bg-canvas text-sm"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 mt-1 rounded-xl text-base font-semibold"
          >
            {isPending ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm font-normal text-ink/60">
        <Link href="/login" className="text-ink font-semibold hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
