'use client';

import { ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import DashboardPreview from './DashboardPreview';

export default function Hero() {
  return (
    <section id="product" className="relative w-full overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-24">
        <div className="animate-fade-in-up relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-1.5 shadow-sm">
            <span className="text-sm font-medium text-black">
              For product teams
            </span>
            <span className="text-sm font-medium text-brand-500">✦</span>
          </div>

          <div className="mb-6 flex flex-col items-center leading-none text-center">
            <h1 className="text-5xl font-medium tracking-[-0.02em] text-black md:text-8xl md:leading-[1.02]">
              <span className="block">Your customers already</span>
              <span className="block mt-2">
                told you{' '}
                <span className="font-serif font-normal italic text-[#3a04ff]">
                  what&apos;s wrong.
                </span>
              </span>
            </h1>
          </div>

          <p className="mb-8 max-w-2xl text-center text-base leading-7 text-[#525252] md:text-lg">
            Reviews, tickets, comments, surveys — they&apos;re all screaming the
            same things. Scalo connects every source into one searchable brain
            so your team can finally close the gap between what customers say
            and what you ship.
          </p>

          <Link href="/signup" className="group relative">
            <span className="relative flex h-14 items-center rounded-xl bg-[#3a04ff] pr-11">
              <span className="flex h-full items-center rounded-xl bg-black px-6 text-[15px] font-medium leading-6 text-white">
                Close the gap
              </span>
              <span className="absolute right-0 flex size-11 items-center justify-center rounded-xl text-white">
                <ArrowDownRight
                  size={20}
                  className="transition-transform duration-300 group-hover:-rotate-45 group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </Link>
        </div>

        <div className="-mt-2 flex w-full px-4 md:justify-center">
          <div className="w-full max-w-[1022px] overflow-x-auto md:overflow-visible bg-transparent pb-4 md:pb-0 scrollbar-hide">
            <div className="w-[1022px] shrink-0">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
