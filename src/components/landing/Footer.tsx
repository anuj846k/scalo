import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type FooterLinkGroup = {
  title: string;
  minWidth?: string;
  links: { label: string; href: string }[];
};

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'MENU',
    minWidth: 'min-w-[70.06px]',
    links: [
      { label: 'Product', href: '#product' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      // { label: 'Terms of Service', href: '/terms' },
      // { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact Us', href: 'mailto:anuj@scalocx.com' },
    ],
  },
  {
    title: 'SOCIAL',
    minWidth: 'min-w-[68.17px]',
    links: [{ label: 'X (Twitter)', href: 'https://x.com/anujxforge' }],
  },
];

const headingClass =
  'flex flex-col items-start self-stretch text-white/50 text-[12px] font-[510] leading-[16px] uppercase';

const linkClass =
  'flex flex-col items-start self-stretch pt-[2.75px] pb-[1.25px] text-white text-[13.7px] font-[400] leading-[20px] hover:text-white/80 transition-colors';

const Footer = () => {
  return (
    <footer className="relative flex w-full flex-col items-start bg-[#F5F5F5] pt-[152px]">
      <div className="flex flex-col items-start self-stretch rounded-tl-[48px] rounded-tr-[48px] bg-primary px-6 md:px-16 lg:px-[213px] pb-[64px] pt-[280px] md:pt-[320px] lg:pt-[384px] rounded-b-none">
        <div className="flex max-w-[1024px] flex-col items-start gap-[88px] self-stretch px-[24px] py-0 mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16 self-stretch">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-[8px]">
              <div className="h-[32px] w-[32px] rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Image
                  src="/logos/logo.svg"
                  alt="Scalo Logo"
                  width={22}
                  height={22}
                  className="object-contain w-5.5 h-5.5"
                />
              </div>
              <span className="flex flex-col items-start text-white font-bold text-xl">
                Scalo
              </span>
            </Link>

            {/* Navigation */}
            <nav
              className="flex items-start flex-wrap md:flex-nowrap gap-8 md:gap-[64px] w-full md:w-auto"
              aria-label="Footer Navigation"
            >
              {FOOTER_LINK_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className={`flex flex-col items-start gap-[16px] self-stretch ${
                    group.minWidth ?? ''
                  }`}
                >
                  <h2 className={headingClass}>{group.title}</h2>

                  <ul className="flex flex-col items-start gap-[8px] self-stretch">
                    {group.links.map((link) => (
                      <li key={link.label} className="self-stretch">
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Support line */}
          <div className="flex flex-col items-start gap-1 self-stretch text-[13.6px] leading-5">
            <span className="text-white/50 text-[12px] font-[510] uppercase tracking-[0.3px]">
              Support
            </span>
            <a
              href="mailto:anuj@scalocx.com"
              className="text-white hover:text-white/80 transition-colors"
            >
              anuj@scalocx.com
            </a>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between self-stretch text-white/50 text-[13.6px] leading-5 w-full gap-4 border-t border-white/10 pt-8">
            <p>© {new Date().getFullYear()} Scalo Inc. All rights reserved.</p>
            <p>The Customer Intelligence Layer for AI</p>
          </div>
        </div>
      </div>

      {/* Overlapping CTA Card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1024px] px-6 md:px-8">
        <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center px-4 py-20 md:py-28 border border-white/20">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 z-0 blur-[7px] scale-[1.02]"
            style={{
              backgroundImage: "url('/Assets/bg2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <h1 className="relative z-10 text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-semibold text-[#0A0A0A] mb-10">
            Your customers are
            <br />
            already talking.
            <br />
            Start listening.
          </h1>

          <Link
            href="/signup"
            className="relative z-10 bg-black text-white px-8 py-4 rounded-full text-base font-semibold tracking-wide flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all shadow-lg border border-white/20 active:scale-95"
          >
            Start building today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
