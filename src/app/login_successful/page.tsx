import React from "react";
import Link from "next/link";

export default function LoginSuccessful() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas font-sans text-ink">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-semibold">Login Successful!</h1>
        <p className="mb-8 text-stone">Welcome to Scalo. You have successfully authenticated.</p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-charcoal"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
