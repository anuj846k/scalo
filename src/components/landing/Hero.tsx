import Link from 'next/link';
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

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center -translate-y-24 sm:-translate-y-20 md:-translate-y-16 lg:-translate-y-12 transition-transform duration-300">
        <div className="relative flex h-[600px] w-[1000px] origin-center scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 2xl:scale-125 transition-transform duration-300">
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <path
              d="M 500 300 L 400 300 C 300 300, 300 120, 200 120 M 400 300 L 100 300 M 400 300 C 300 300, 300 480, 200 480"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.15"
              fill="none"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <path
              d="M 500 300 L 600 300 C 700 300, 700 120, 800 120 M 600 300 L 900 300 M 600 300 C 700 300, 700 480, 800 480"
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
                className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-b ${TONE_STYLES[source.tone]} shadow-xs drop-shadow-sm p-2 overflow-hidden`}
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

          <div className="absolute left-[50%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-xl p-4">
            <Image
              src="/logos/logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-10 2xl:bottom-20 flex flex-col items-center justify-center px-4 w-full max-w-4xl z-20">
        <p className="text-xl  lg:text-3xl font-semibold mb-2 text-center selection:bg-[#3a04ff] selection:text-white tracking-tight">
          Every customer voice,
        </p>
        <p className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl 2xl:text-6xl font-semibold mb-4 text-center tracking-tight">
          one searchable brain.
        </p>
        <p className="text-sm sm:text-base md:text-md text-gray-700 mb-4 text-center leading-normal max-w-2xl md:max-w-lg">
          Scalo connects reviews, tickets, comments, and surveys — so you can
          ask in plain language and get evidence-backed answers, with citations.
        </p>
        <Link
          href="/signup"
          className="bg-gradient-to-b from-[#3a04ff] to-[#8b5cf6] text-white p-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all font-semibold"
        >
          Start free
        </Link>
      </div>
    </section>
  );
}
