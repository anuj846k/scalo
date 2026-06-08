"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

export default function AuthLayout({ children, imageSrc }: AuthLayoutProps) {
  const pathname = usePathname();
  const activeImage =
    imageSrc ||
    (pathname?.includes("signup") ? "/auth/signup.png" : "/auth/image.png");

  return (
    <main className="relative flex h-screen font-sans overflow-hidden bg-neutral-100">
      <div className="absolute inset-0 z-0 hidden lg:flex items-center justify-center w-[calc(100%-520px)] p-12 xl:p-20">
        <div className="relative w-full h-full max-w-[1130px] max-h-[1014px] left-28">
          <Image
            src={activeImage}
            alt="Collaboration illustration"
            width={1000}
            height={1000}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 ml-auto flex items-center justify-center w-full lg:w-[520px] lg:min-w-[480px] p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-[440px] bg-canvas-soft rounded-xl p-8 sm:p-10 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}