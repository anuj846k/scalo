import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#87a8c8] to-[#f5e9d8] px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="mb-8 inline-flex items-center rounded-full border border-ink/10 bg-canvas/30 px-3 py-1 text-sm font-medium text-ink backdrop-blur-sm">
          Introducing Scalo v1.0
        </div>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-7xl">
          The AI CMO your brand cannot afford to hire.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/80 sm:text-xl max-w-2xl mx-auto">
          Scalo takes you from a simple campaign brief to live, optimised ads running across every major platform — with no agency, no manual design work, and no slow human reaction time.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-brand-green px-8 text-base font-medium text-primary transition-colors hover:bg-brand-green-deep"
          >
            Get started for free
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-transparent border border-ink/20 px-8 text-base font-medium text-ink transition-colors hover:bg-ink/5"
          >
            See how it works
          </Link>
        </div>
      </div>

      {/* Decorative cloud-like abstraction or soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-canvas/20 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
