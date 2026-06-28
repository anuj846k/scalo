'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

// Constants (match app blue: #3a04ff)
const RING_ACTIVE = '#3a04ff';
const RING_TRACK = '#93c5fd';
const REVIEW_DURATION_MS = 10000;

// Ring radius in SVG viewBox (96px container, m-2 gap)
const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Types
interface TeamMember {
  name: string;
  title: string;
  img: string;
  company: string;
  review: string;
}

// Data
const teamMembers: TeamMember[] = [
  {
    name: 'Jennifer Walsh',
    title: 'Product Manager',
    img: '/Assets/JenniferWalsh.png',
    company: 'CommandR',
    review:
      'Before Scalo, our PM read Google reviews, engineering read Zendesk, and nobody talked to each other. Now we all see the same picture — and ship fixes the same week.',
  },
  {
    name: 'Michael Torres',
    title: 'Head of Product',
    img: '/Assets/MichealTorres.png',
    company: 'Interlock',
    review:
      'We used to lose a full sprint every quarter just triaging feedback spreadsheets. Scalo cut that to zero. Our response time to user pain went from weeks to days.',
  },
  {
    name: 'Amanda Chen',
    title: 'Director of Analytics',
    img: '/Assets/AmandaChen.png',
    company: 'FocalPoint',
    review:
      'We caught a critical checkout regression within 30 minutes of deploy because Scalo surfaced the sentiment drop instantly. Before, that would have been a week of angry emails.',
  },
  {
    name: 'David Patterson',
    title: 'VP of Growth',
    img: '/Assets/DavidPatterson.png',
    company: 'AcmeCorp',
    review:
      'At 50K reviews a month, manual analysis was impossible. Scalo made it feel like we have a team of 20 reading every single one.',
  },
];

// Sub-components
interface AvatarButtonProps {
  member: TeamMember;
  isActive: boolean;
  onClick: () => void;
}

const AvatarButton = ({ member, isActive, onClick }: AvatarButtonProps) => {
  const { name, img } = member;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex justify-center items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 w-[96px] h-[96px]"
      aria-label={`View testimonial from ${name}`}
      aria-pressed={isActive}
    >
      <div
        className={`relative flex justify-center items-center w-[96px] h-[96px] origin-center transition-transform duration-300 ease-out ${
          isActive ? 'scale-100' : 'scale-[0.68]'
        }`}
      >
        {isActive && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke={RING_TRACK}
              strokeWidth="1.5"
              className="opacity-70"
            />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke={RING_ACTIVE}
              strokeWidth="1.5"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeLinecap="round"
              style={
                {
                  strokeDashoffset: RING_CIRCUMFERENCE,
                  animation: `trustedByRing ${REVIEW_DURATION_MS}ms linear forwards`,
                } as React.CSSProperties
              }
            />
          </svg>
        )}
        {/* m-2 (8px) gap between outer ring and inner ring */}
        <div
          className={`relative z-10 flex justify-center items-center rounded-full overflow-hidden bg-white transition-all duration-300 m-2 ${
            isActive
              ? 'w-[72px] h-[72px] border-[6px] border-[#3a04ff]'
              : 'w-[56px] h-[56px] border-0'
          }`}
        >
          <Image
            src={img}
            alt={name}
            width={72}
            height={72}
            className={`shrink-0 rounded-full object-cover transition-all duration-300 ${
              isActive
                ? 'w-[60px] h-[60px] grayscale-0'
                : 'w-[56px] h-[56px] grayscale opacity-80'
            }`}
          />
        </div>
      </div>
    </button>
  );
};

interface TestimonialPanelProps {
  member: TeamMember;
  isActive: boolean;
}

const TestimonialPanel = ({ member, isActive }: TestimonialPanelProps) => {
  const { name, title, review, company } = member;

  return (
    <div
      role="tabpanel"
      className={`absolute inset-0 w-full transition-[opacity,transform] duration-700 ease-out ${
        isActive
          ? 'opacity-100 translate-y-0 z-10'
          : 'opacity-0 translate-y-4 z-0 pointer-events-none'
      }`}
    >
      <p className="text-xl leading-[32px] font-normal text-[rgba(38,38,38,0.78)] max-w-xl py-1">
        {review}
      </p>
      <p className="mt-5 text-base font-semibold leading-6 text-[#404040]">
        {name}, {title} @ {company}
      </p>
    </div>
  );
};

// Main component
const TrustedBy = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleAvatarClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, REVIEW_DURATION_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex w-full px-6 md:px-16 lg:px-[223px] py-24 flex-col items-start border-t border-b border-[rgba(59,130,246,0.15)] bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes trustedByRing { from { stroke-dashoffset: ${RING_CIRCUMFERENCE} } to { stroke-dashoffset: 0 } }`,
        }}
      />
      <div className="max-w-[1024px] self-stretch w-full mx-auto">
        <div className="flex flex-col items-start w-full gap-16">
          <h1 className="text-4xl md:text-[60px] leading-tight md:leading-[75px] font-semibold text-primary">
            Trusted by teams worldwide
          </h1>

          <div className="flex flex-col items-start w-full gap-6">
            <div className="flex flex-col lg:flex-row w-full items-start gap-12 lg:gap-16 py-8">
              <div className="flex items-center gap-4 sm:gap-8 shrink-0 flex-wrap sm:flex-nowrap">
                {teamMembers.map((member, index) => (
                  <AvatarButton
                    key={member.name}
                    member={member}
                    isActive={index === activeIndex}
                    onClick={() => handleAvatarClick(index)}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0 py-2 w-full">
                <div className="relative w-full min-h-48 rounded-xl bg-white/80 px-4 py-3 overflow-hidden">
                  {teamMembers.map((member, index) => (
                    <TestimonialPanel
                      key={member.name}
                      member={member}
                      isActive={index === activeIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
