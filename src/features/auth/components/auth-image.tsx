'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AuthImage({ imageSrc }: { imageSrc?: string }) {
  const pathname = usePathname();
  const activeImage =
    imageSrc ||
    (pathname?.includes('signup') ? '/auth/signup.png' : '/auth/image.png');

  return (
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
  );
}
