import React from 'react';
import Navbar from '@/components/landing/Navbar';
import AuthImage from './auth-image';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

export default function AuthLayout({ children, imageSrc }: AuthLayoutProps) {
  return (
    <main className="relative flex h-screen font-sans overflow-hidden">
      <Navbar />
      <AuthImage imageSrc={imageSrc} />
      <div className="relative py-100 z-10 ml-auto flex items-center justify-center w-full lg:w-[520px] lg:min-w-[480px]">
        <div className="w-full max-w-[400px] rounded-3xl p-2 sm:p-4 border border-[#4a58eb]/30">
          {children}
        </div>
      </div>
    </main>
  );
}
