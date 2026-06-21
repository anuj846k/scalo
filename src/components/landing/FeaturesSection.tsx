'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(0);

  const features = [
    {
      title: 'User-Centric Interface',
      desc: 'Intuitive, responsive design built for seamless experiences across devices.',
    },
    {
      title: 'Real-Time Sync',
      desc: 'Keep all your data synced instantly across all your team members and devices without hitting refresh.',
    },
    {
      title: 'Advanced Customization',
      desc: 'Tailor the platform to fit your exact workflow with our powerful customization engine.',
    },
  ];

  return (
    <section id="features" className="bg-[#EAEAEA] py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl bg-white rounded-4xl p-10 border border-white/20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[3.5rem] leading-none font-bold tracking-tighter text-black">
                    4X
                  </span>
                  <div className="flex text-[#8c46fb]">
                    <svg
                      className="w-8 h-8 opacity-100 -ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <svg
                      className="w-8 h-8 opacity-50 -ml-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <svg
                      className="w-8 h-8 opacity-20 -ml-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-snug pr-4">
                  Double your team's productivity with our smart, scalable
                  tools.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="bg-white rounded-xl py-2 px-4 flex flex-col justify-center bg-linear-to-b from-transparent to-[#3a04ff]/15 drop-shadow-xs">
                  <p className="text-gray-800 text-xs">Instant Scheduling</p>
                </div>
                <div className="bg-white rounded-xl py-2 px-4 bg-linear-to-b from-transparent to-[#3a04ff]/15 drop-shadow-xs flex flex-col justify-center">
                  <p className="text-gray-800 text-xs">Progress Tracking</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl h-[260px] overflow-hidden flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="absolute top-0 w-full h-full pointer-events-none">
                <Image
                  src="/landing/card5.png"
                  alt="card3"
                  fill
                  className="object-cover object-center rounded-3xl p-1"
                />
                <div className="absolute inset-0 bg-linear-to-b from-[#F9FAFB]/80 via-transparent to-[#F9FAFB] rounded-2xl"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:pl-6 h-full justify-between">
            <div className="w-full">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-10 leading-[1.1]">
                Smart Features That
                <br />
                Make a Difference
              </h2>

              <div className="w-full space-y-5 min-h-[260px]">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`border-b ${activeFeature === index ? 'border-gray-200 pb-5' : 'border-gray-200 pb-5'} cursor-pointer`}
                    onClick={() =>
                      setActiveFeature(activeFeature === index ? null : index)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3
                          className={`text-md transition-colors ${activeFeature === index ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {feature.title}
                        </h3>
                      </div>
                      {activeFeature === index ? (
                        <svg
                          className="w-4 h-4 text-[#8c46fb]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15.75l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      )}
                    </div>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${activeFeature === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-gray-500 text-[14px] leading-relaxed pr-8 pt-2">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              className="group relative inline-block cursor-pointer overflow-hidden transition-all duration-300 border border-[#e4e4ff] hover:border-transparent p-2 px-5 rounded-xl shadow-xs text-sm bg-white"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-[#3a04ff] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
              <span className="relative z-10 text-black transition-colors duration-300 ease-in-out group-hover:text-white font-medium">
                Start for Free
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
