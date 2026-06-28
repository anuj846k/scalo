'use client';

import { useEffect, useRef, useState } from 'react';
import { Component1, Component2, Component3 } from '../icons';
import { Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Plug in where your customers already talk',
    description:
      'Google Reviews, Zendesk, Instagram, App Store, CSV — connect in minutes. No schema mapping, no engineering sprint.',
    Icon: Component1,
  },
  {
    title: 'Every voice, one language',
    description:
      'Scalo normalizes every feedback item into a shared schema and generates semantic embeddings. Similar complaints group together — even when customers use different words.',
    Icon: Component2,
  },
  {
    title: 'Ask like you\u2019d ask a teammate',
    description:
      '"What are users struggling with in onboarding?" — Scalo searches across every source and returns the real answers, not keyword matches.',
    Icon: Component3,
  },
  {
    title: 'Get evidence, not vibes',
    description:
      'Every answer cites the exact review, ticket, or comment it came from. Dates, trends, source links. Make decisions your team can defend.',
    Icon: Sparkles,
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsListRef = useRef<HTMLUListElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);

  const [lineTop, setLineTop] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const lineHeightRef = useRef(0);

  const measureLine = () => {
    const stepsList = stepsListRef.current;
    const container = lineContainerRef.current;
    if (!stepsList || !container) return;

    const items = stepsList.querySelectorAll('li');
    if (items.length < 2) return;

    const firstIcon = items[0].querySelector<HTMLDivElement>(
      'div[class*="rounded-full"]',
    );
    const lastIcon = items[items.length - 1].querySelector<HTMLDivElement>(
      'div[class*="rounded-full"]',
    );
    if (!firstIcon || !lastIcon) return;

    const containerRect = container.getBoundingClientRect();
    const firstRect = firstIcon.getBoundingClientRect();
    const lastRect = lastIcon.getBoundingClientRect();

    const firstCenterY =
      firstRect.top - containerRect.top + firstRect.height / 2;
    const lastCenterY = lastRect.top - containerRect.top + lastRect.height / 2;
    const height = Math.max(0, lastCenterY - firstCenterY);

    lineHeightRef.current = height;
    setLineTop(firstCenterY);
    setLineHeight(height);
  };

  const updateProgress = () => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const start = windowHeight * 0.8;
    const end = -rect.height * 0.3;
    const total = start - end;
    const current = start - rect.top;
    const progress = Math.max(0, Math.min(1, current / total));

    setProgressHeight(progress * lineHeightRef.current);
  };

  useEffect(() => {
    const run = () => {
      measureLine();
      updateProgress();
    };

    const t = setTimeout(run, 50);

    const handleResize = () => {
      measureLine();
      updateProgress();
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex w-full flex-col bg-[#F5F5F5] px-6 md:px-16 lg:px-[223px] py-0"
    >
      <div className="flex flex-col lg:flex-row max-w-5xl gap-16 lg:gap-20 px-6 py-28 mx-auto w-full">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-[23.4px]">
          <h2 className="text-4xl md:text-[60px] font-semibold text-primary">
            How it works
          </h2>

          <p className="max-w-md text-[16.9px] leading-[29.25px] text-[rgba(10,10,10,0.60)] font-normal">
            Your customer feedback repository, ingested by AI and organized into
            an{' '}
            <span className="font-normal text-primary">
              intelligent search brain,
            </span>{' '}
            ready to surface answers with citations.
          </p>

          <a className="w-fit rounded-2xl bg-primary px-6 py-3 text-[13.7px] font-medium text-white shadow-md hover:opacity-90 cursor-pointer transition-all">
            Start Syncing
          </a>
        </div>

        {/* Right */}
        <div ref={lineContainerRef} className="relative flex flex-1 flex-col">
          {lineHeight > 0 && (
            <div
              className="absolute left-6 w-0.5"
              style={{ top: `${lineTop}px`, height: `${lineHeight}px` }}
            >
              {/* Static */}
              <div className="absolute inset-0 bg-neutral-300" />

              {/* Progress – smooth transition when height updates */}
              <div
                className="absolute top-0 w-full bg-[#3a04ff] transition-[height] duration-500 ease-out"
                style={{ height: `${progressHeight}px` }}
              />
            </div>
          )}

          <ul ref={stepsListRef} className="flex flex-col">
            {steps.map(({ title, description, Icon }, i) => (
              <li
                key={i}
                className={`flex items-start gap-5 ${
                  i !== steps.length - 1 ? 'pb-32 lg:pb-48' : ''
                }`}
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3a04ff] text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
                    {title}
                  </h3>

                  <p className="max-w-[384px] text-[15.3px] leading-relaxed text-[rgba(10,10,10,0.60)] font-normal">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
