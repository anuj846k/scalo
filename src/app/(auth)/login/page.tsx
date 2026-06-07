"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/login_successful"); // redirect to success page
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <main className="relative flex min-h-screen font-sans overflow-hidden">
      <Image
        src="/auth/image.png"
        alt="Collaboration illustration"
        fill
        className="object-cover object-center"
        priority
      />

      <Link
        href="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2.5 no-underline"
      >
        <span className="text-base font-semibold text-ink tracking-tight">
          Scalo
        </span>
      </Link>

      {/* ── Right-side floating form panel ── */}
      <div className="relative z-10 ml-auto flex items-center justify-center w-full lg:w-[520px] lg:min-w-[480px] p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-[440px] bg-canvas border border-hairline rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 sm:p-10">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[28px] font-semibold leading-tight tracking-[0.5px] text-ink mb-2">
              Welcome back
            </h2>
          </div>

          {/* OAuth */}
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-2.5 w-full h-10 bg-canvas border border-hairline rounded-full text-sm font-medium text-ink cursor-pointer no-underline transition-colors duration-150 hover:bg-surface hover:border-stone/40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-hairline" />
            <span className="text-xs font-medium text-mute whitespace-nowrap">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-hairline" />
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[13px] font-medium text-charcoal"
                htmlFor="login-email"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  className="w-full h-10 pl-4 pr-10 bg-canvas border border-hairline rounded-lg text-base font-normal text-ink outline-none transition-all duration-150 placeholder:text-mute placeholder:text-sm focus:border-brand-green focus:ring-[3px] focus:ring-brand-green/10 appearance-none"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-[13px] font-medium text-charcoal"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-steel no-underline transition-colors duration-150 hover:text-ink"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="w-full h-10 pl-4 pr-10 bg-canvas border border-hairline rounded-lg text-base font-normal text-ink outline-none transition-all duration-150 placeholder:text-mute placeholder:text-sm focus:border-brand-green focus:ring-[3px] focus:ring-brand-green/10 appearance-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mute bg-transparent border-none flex items-center justify-center p-0 cursor-pointer hover:text-steel transition-colors duration-150"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-10 mt-1 px-5 bg-ink text-canvas border-none rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-charcoal active:bg-slate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign up nudge */}
          <p className="mt-6 text-center text-[13px] text-stone">
            New to Scalo?{" "}
            <Link
              href="/signup"
              className="text-ink font-medium no-underline hover:underline"
            >
              Create a free account
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-5 text-center text-[11px] text-mute leading-normal">
            By signing in you agree to our{" "}
            <a
              href="/terms"
              className="text-steel no-underline hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-steel no-underline hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}