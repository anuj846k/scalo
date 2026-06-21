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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/setup");
        },
        onError: (ctx) => {
          alert(ctx.error.message || "An error occurred during registration.");
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-medium tracking-tight">
          Create an account
        </h2>
      </div>

      <a
        href="/api/auth/google"
        className="relative overflow-hidden flex items-center justify-center gap-2.5 w-full h-10 bg-canvas border border-ink/20 rounded-xl font-medium text-base text-ink cursor-pointer no-underline transition-all hover:bg-canvas-soft hover:border-ink/30"
      >
        <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[#3a04ff]/15 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-[#8b5cf6]/15 to-transparent pointer-events-none" />
        <Image src="/google.svg" alt="Google" width={16} height={16} className="z-10" />
        <span className="z-10">Continue with Google</span>
      </a>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 border-t border-ink/20" />
        <span className="text-sm font-medium text-ink/50 whitespace-nowrap">
          or continue with email
        </span>
        <div className="flex-1 border-t border-ink/20" />
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    className="h-10 px-3 bg-canvas text-sm"
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-10 px-3 bg-canvas text-sm"
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
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-10 pl-3 pr-10 bg-canvas text-sm"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-ink/40 hover:text-ink/80 hover:bg-transparent"
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
          className="w-full h-10 mt-1 rounded-xl text-base font-semibold"
        >
          {isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm font-normal text-ink/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-ink font-semibold hover:underline"
        >
          Login here
        </Link>
      </p>

      <p className="mt-4 max-w-[300px] mx-auto text-center text-xs font-normal text-ink/50 leading-normal">
        By signing up you agree to our{" "}
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