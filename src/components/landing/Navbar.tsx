import { ArrowDown, LeftWingCurve, RightWingCurve } from '@/components/icons';
import { ArrowDownRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/lib/auth-utils';

const navItems = [
  { label: 'Product', href: '#product', hasDropdown: false },
  { label: 'Features', href: '#features', hasDropdown: false },
  { label: 'Pricing', href: '#pricing', hasDropdown: false },
];

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex justify-center items-start">
      <div className="flex items-start w-full px-4 md:px-0 md:w-auto">
        <LeftWingCurve className="hidden md:block h-12.5 w-12.5 text-white shrink-0" />

        {/* Central Content */}
        <div className="bg-white text-black px-4 flex items-center justify-between h-[80px] w-full max-w-[1024px] rounded-b-[32px] text-[14.4px] font-medium leading-5 tracking-wide">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:pl-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/logos/logo.svg"
                alt="Scalo Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">Scalo</span>
          </Link>

          {/* Nav Links (centered) */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center rounded-full px-4 h-9 transition-colors hover:bg-gray-100 text-primary"
              >
                {item.label}
                {item.hasDropdown && (
                  <ArrowDown className="ml-1 size-4 shrink-0" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4 pr-2">
            {user ? (
              <Link
                href="/dashboard"
                className="group relative flex items-stretch h-11 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center bg-black text-white px-5 text-sm font-semibold rounded-xl tracking-widest">
                  Dashboard
                </span>
                <span className="flex items-center justify-center bg-[#3a04ff] text-white pl-5 pr-3 -ml-3 rounded-r-xl">
                  <ArrowDownRight
                    size={18}
                    className="transition-transform duration-300 group-hover:-rotate-45"
                  />
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-gray-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="group relative flex items-stretch h-11 hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center bg-black text-white px-5 text-sm font-semibold rounded-xl tracking-widest">
                    Get Started
                  </span>
                  <span className="flex items-center justify-center bg-[#3a04ff] text-white pl-5 pr-3 -ml-3 rounded-r-xl">
                    <ArrowDownRight
                      size={18}
                      className="transition-transform duration-300 group-hover:-rotate-45"
                    />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right side: Hamburger */}
          <div className="flex md:hidden items-center pr-2">
            <label
              htmlFor="mobile-menu-toggle"
              className="p-2 text-primary cursor-pointer flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </label>
          </div>
        </div>

        {/* Right Wing */}
        <RightWingCurve className="hidden md:block h-12.5 w-12.5 text-white shrink-0" />
      </div>

      {/* Hidden checkbox for mobile menu toggle (pure CSS) */}
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

      {/* Mobile Menu Overlay */}
      <div className="fixed inset-0 z-[100] hidden peer-checked:flex flex-col items-center justify-center bg-black/85 backdrop-blur-lg transition-all duration-300">
        <label
          htmlFor="mobile-menu-toggle"
          className="absolute top-6 right-6 text-white p-2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </label>

        <div className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white text-3xl font-medium tracking-tight transition-all hover:text-white/80 active:scale-95"
            >
              {item.label}
            </Link>
          ))}

          <div className="w-12 h-px bg-white/25 my-4" />

          {user ? (
            <Link
              href="/dashboard"
              className="bg-white text-black px-8 py-3.5 rounded-full text-xl font-semibold tracking-wide transition-all hover:scale-105 active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white text-2xl font-medium transition-all hover:text-white/80 active:scale-95"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="mt-2 bg-white text-black px-8 py-3.5 rounded-full text-xl font-semibold tracking-wide transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
