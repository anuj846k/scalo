export default function FeaturesSection() {
  return (
    <section id="features" className="bg-surface-soft py-24 sm:py-32 px-6 lg:px-8 border-y border-hairline">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Meet your new AI CMO.
          </h2>
          <p className="mt-4 text-lg text-steel max-w-2xl">
            Scalo takes your objective and budget as input, and manages everything from that point forward. It does not just assist a human marketer. It acts as the marketer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* V1: Unified Management */}
          <div className="bg-canvas p-8 rounded-2xl border border-hairline hover:border-hairline-soft transition-colors flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 bg-primary-pale text-positive-deep rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ink">Unified Management</h3>
            <p className="mt-3 text-sm text-steel flex-1">
              Set one budget, and Scalo allocates it across Meta and Google Ads dynamically. View CTR, ROAS, and CPA in a single dashboard without jumping between native platform logins.
            </p>
          </div>

          {/* V2: Autonomous Engine */}
          <div className="bg-canvas p-8 rounded-2xl border border-hairline hover:border-hairline-soft transition-colors flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-green-deep rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ink">Autonomous Engine</h3>
            <p className="mt-3 text-sm text-steel flex-1">
              Scalo evaluates ads continuously using the Unified Engagement Score (UES). It mutates underperforming ads and pauses losers automatically. It detects creative fatigue before performance drops.
            </p>
          </div>

          {/* V3: Trend Intelligence */}
          <div className="bg-canvas p-8 rounded-2xl border border-hairline hover:border-hairline-soft transition-colors flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 bg-accent-orange/20 text-warning-deep rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ink">Trend Intelligence</h3>
            <p className="mt-3 text-sm text-steel flex-1">
              Generate production-ready creatives directly from a text brief. Winning patterns from top-performing ads become trend signals shared across the entire Scalo ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
