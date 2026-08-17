'use client';

import { useState } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

type GoogleSignInButtonProps = {
  /** Where existing users land after Google OAuth. */
  callbackURL?: string;
  /** Where brand-new users land after Google OAuth. */
  newUserCallbackURL?: string;
  label?: string;
};

export function GoogleSignInButton({
  callbackURL = '/dashboard',
  newUserCallbackURL = '/setup',
  label = 'Continue with Google',
}: GoogleSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
        newUserCallbackURL,
      });
    } catch (error) {
      setIsPending(false);
      alert(
        error instanceof Error
          ? error.message
          : 'Could not start Google sign-in.',
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="relative overflow-hidden flex items-center justify-center gap-2.5 w-full h-10 bg-canvas border border-ink/20 rounded-xl font-medium text-base text-ink cursor-pointer transition-all hover:bg-canvas-soft hover:border-ink/30 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[#3a04ff]/15 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-[#8b5cf6]/15 to-transparent pointer-events-none" />
      <Image src="/google.svg" alt="" width={16} height={16} className="z-10" />
      <span className="z-10">
        {isPending ? 'Redirecting to Google...' : label}
      </span>
    </button>
  );
}
