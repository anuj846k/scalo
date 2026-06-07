import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas-soft px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto  text-center relative z-10">
        <div className="mb-8 inline-flex items-center rounded-pill border border-ink/10 bg-canvas px-4 py-1 text-sm font-semibold text-ink shadow-sm">
          Introducing Scalo for Agencies
        </div>
        <h1 className="text-5xl font-black sm:text-7xl text-ink">
          Creator outreach, scaled.
        </h1>
        <p className="mt-8 text-lg font-normal text-ink/80 max-w-2xl mx-auto">
          The AI-powered CRM for creator partnerships. Manage creators, run personalized outreach campaigns, and track pipeline metrics from a single dashboard.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-on-primary transition-colors hover:bg-primary-active"
          >
            Start your campaign
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl bg-canvas px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-canvas-soft border border-ink"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
