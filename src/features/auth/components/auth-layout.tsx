import React from 'react';
import Navbar from '@/components/landing/Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex h-screen items-center justify-center font-sans overflow-hidden">
      <Navbar />
      <div className="relative z-10 flex w-full items-center justify-center px-4">
        <div className="w-full max-w-[400px] rounded-3xl p-2 sm:p-4 border border-[#4a58eb]/30">
          {children}
        </div>
      </div>
    </main>
  );
}
