"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard"); // redirect to dashboard
        },
        onError: (ctx) => {
          alert(ctx.error.message || "An error occurred during login.");
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-ink mb-2">
          Welcome back
        </h2>
      </div>

      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-2.5 w-full h-12 bg-canvas border border-ink rounded-xl text-base font-semibold text-ink cursor-pointer no-underline transition-colors duration-150 hover:bg-canvas-soft"
      >
        <Image src="/google.svg" alt="Google" width={24} height={24} />
        Continue with Google
      </a>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-sm font-normal text-ink/50 whitespace-nowrap">
          or continue with email
        </span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email address</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-12 px-4 bg-canvas"
                    {...field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between w-full">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-normal text-ink/70 hover:text-ink transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative w-full">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 pl-4 pr-10 bg-canvas"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-ink/40 hover:text-ink/80 hover:bg-transparent"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
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
          className="w-full h-12 mt-2 rounded-xl text-base font-semibold"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-normal text-ink/60">
        New to Scalo?{" "}
        <Link
          href="/signup"
          className="text-ink font-semibold hover:underline"
        >
          Create a free account
        </Link>
      </p>

      <p className="mt-6 text-center text-xs font-normal text-ink/50 leading-normal">
        By signing in you agree to our{" "}
        <a
          href="/terms"
          className="text-ink/70 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-ink/70 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </>
  );
}
