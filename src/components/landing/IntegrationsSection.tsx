'use client';

import Image from 'next/image';

type Source = {
  name: string;
  file: string;
  tone: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'sky';
  left: string;
  top: string;
};

const SOURCES: Source[] = [
  {
    name: 'Google Reviews',
    file: 'google.svg',
    tone: 'yellow',
    left: '20%',
    top: '20%',
  },
  {
    name: 'Instagram',
    file: 'instagram.svg',
    tone: 'pink',
    left: '10%',
    top: '50%',
  },
  {
    name: 'CSV uploads',
    file: 'csv.svg',
    tone: 'blue',
    left: '20%',
    top: '80%',
  },
  {
    name: 'Zendesk',
    file: 'zendesk.svg',
    tone: 'green',
    left: '80%',
    top: '20%',
  },
  {
    name: 'Trustpilot',
    file: 'trustpilot.png',
    tone: 'orange',
    left: '90%',
    top: '50%',
  },
  {
    name: 'App Store',
    file: 'app-store.svg',
    tone: 'sky',
    left: '80%',
    top: '80%',
  },
];

const TONE_STYLES: Record<Source['tone'], string> = {
  yellow: 'from-yellow-200 to-yellow-500',
  pink: 'from-pink-200 to-pink-500',
  blue: 'from-blue-200 to-blue-500',
  green: 'from-green-200 to-green-500',
  orange: 'from-orange-200 to-orange-500',
  sky: 'from-sky-200 to-sky-500',
};

export default function IntegrationsSection() {
  return (
    <section className="relative flex flex-col items-center justify-center bg-white py-24 px-4 overflow-hidden w-full border-b border-[rgba(59,130,246,0.15)]">
      <div className="max-w-5xl w-full text-center mb-12">
        <h2 className="text-4xl md:text-[56px] leading-tight font-semibold tracking-tight text-primary">
          Connect all your feedback channels
        </h2>
        <p className="mt-4 text-[#737373] text-[16.9px] leading-[29.25px] max-w-2xl mx-auto font-normal">
          Sync reviews, support tickets, social media comments, and uploads.
          Scalo brings them all together into one structured, searchable brain.
        </p>
      </div>

      <div className="relative flex h-[500px] w-full max-w-[1000px] items-center justify-center transition-transform duration-300">
        <div className="relative flex h-[500px] w-[1000px] origin-center scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-[0.95] xl:scale-100 transition-transform duration-300">
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <path
              d="M 500 250 L 400 250 C 300 250, 300 100, 200 100 M 400 250 L 100 250 M 400 250 C 300 250, 300 400, 200 400"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.15"
              fill="none"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <path
              d="M 500 250 L 600 250 C 700 250, 700 100, 800 100 M 600 250 L 900 250 M 600 250 C 700 250, 700 400, 800 400"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.15"
              fill="none"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>

          {SOURCES.map((source) => {
            const isPng = source.file.endsWith('.png');
            return (
              <div
                key={source.name}
                className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-b ${TONE_STYLES[source.tone]} shadow-xs drop-shadow-sm p-2.5 overflow-hidden transition-transform duration-300 hover:scale-110`}
                style={{ left: source.left, top: source.top }}
              >
                <Image
                  src={`/logos/${source.file}`}
                  alt={source.name}
                  width={60}
                  height={60}
                  className={`relative z-10 rounded-xl object-contain ${isPng ? 'bg-white p-1' : ''}`}
                />
              </div>
            );
          })}

          <div className="absolute left-[50%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-xl p-5 border border-gray-150">
            <Image
              src="/logos/logo.svg"
              alt="Scalo Logo"
              width={64}
              height={64}
              className="rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
