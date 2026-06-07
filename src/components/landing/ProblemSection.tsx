export default function ProblemSection() {
  return (
    <section className="relative bg-canvas py-24 sm:py-32 px-6 lg:px-8 overflow-hidden">
      {/* Decorative vertical dashed lines mapping to max-width container */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-6xl border-x border-hairline border-dashed pointer-events-none opacity-50" />

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            The agency model is <span className="text-brand-error">broken</span>.
          </h2>
          <p className="mt-6 text-lg text-steel max-w-2xl mx-auto">
            Running effective advertising today forces you to choose between expensive agencies, impossible in-house hiring, or spending your own time wrestling with complex tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: The Cost Drain */}
          <div className="bg-surface-soft rounded-[32px] overflow-hidden flex flex-col border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-canvas to-surface-soft/50 w-full overflow-hidden">
              <div className="w-56 bg-canvas rounded-2xl shadow-sm border border-hairline p-5 -rotate-3 transition-transform hover:rotate-0">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-3 w-16 bg-hairline-soft rounded-full" />
                  <div className="h-3 w-10 bg-hairline-soft rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-2 w-20 bg-hairline-soft rounded-full" />
                    <div className="h-2 w-12 bg-hairline-soft rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-2 w-24 bg-hairline-soft rounded-full" />
                    <div className="h-2 w-14 bg-hairline-soft rounded-full" />
                  </div>
                  <div className="pt-4 mt-2 border-t border-hairline flex justify-between items-center">
                    <div className="text-sm font-semibold text-brand-error">Agency Fee</div>
                    <div className="text-sm font-bold text-brand-error">-40%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-xl font-semibold text-ink">The Cost Drain</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                Brands pay 20–40% of their marketing budget just to have humans place and monitor ads. A brand spending ₹5 lakhs/month pays up to ₹2 lakhs/month purely in agency fees — before a single rupee reaches a customer.
              </p>
            </div>
          </div>

          {/* Card 2: The Speed Problem */}
          <div className="bg-surface-soft rounded-[32px] overflow-hidden flex flex-col border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-canvas to-surface-soft/50 w-full overflow-hidden">
              <div className="w-72 bg-canvas rounded-2xl shadow-sm border border-hairline p-4 translate-x-4 translate-y-4 transition-transform hover:translate-x-0 hover:translate-y-0">
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-brand-error/10 flex items-center justify-center text-brand-error font-bold">
                    !
                  </div>
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-3 w-32 bg-hairline-soft rounded-full" />
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-hairline-soft rounded-full" />
                      <div className="h-2 w-4/5 bg-hairline-soft rounded-full" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-surface rounded-md border border-hairline-soft text-xs font-medium text-steel">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response pending (48h)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-xl font-semibold text-ink">The Speed Problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                When an ad underperforms or causes brand damage, human agencies take hours or days to react. By the time a decision is made, budget has been wasted and in severe cases, damage has spread.
              </p>
            </div>
          </div>

          {/* Card 3: The Creative Bottleneck */}
          <div className="bg-surface-soft rounded-[32px] overflow-hidden flex flex-col border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-canvas to-surface-soft/50 w-full overflow-hidden">
              <div className="relative w-64 h-48 mt-8">
                <div className="absolute top-0 left-0 w-40 h-40 bg-canvas rounded-2xl border border-hairline shadow-sm rotate-[-8deg] transition-transform hover:rotate-[-12deg]" />
                <div className="absolute top-4 left-6 w-40 h-40 bg-canvas rounded-2xl border border-hairline shadow-sm rotate-[4deg] transition-transform hover:rotate-[8deg]" />
                <div className="absolute top-8 left-16 w-40 h-40 bg-canvas rounded-2xl border border-brand-green shadow-md flex items-center justify-center bg-gradient-to-br from-canvas to-primary-pale">
                  <div className="bg-ink text-canvas text-xs font-medium px-3 py-1.5 rounded-full shadow-lg absolute -right-4 -bottom-4 border border-hairline/20 z-10 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    V12_final_FINAL.png
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-xl font-semibold text-ink">The Creative Bottleneck</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                Coming up with variations, briefing designers, reviewing iterations, and approving creatives is a slow, expensive back-and-forth process that limits how many ideas a brand can test.
              </p>
            </div>
          </div>

          {/* Card 4: The Fragmentation Tax */}
          <div className="bg-surface-soft rounded-[32px] overflow-hidden flex flex-col border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-canvas to-surface-soft/50 w-full overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="w-28 h-28 bg-canvas rounded-2xl shadow-sm border border-hairline flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] shadow-sm flex items-center justify-center text-white font-bold text-lg">f</div>
                  <div className="h-1.5 w-12 bg-hairline-soft rounded-full" />
                </div>
                <div className="w-28 h-28 bg-canvas rounded-2xl shadow-sm border border-hairline flex flex-col items-center justify-center gap-3 translate-y-6 transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-[#EA4335] shadow-sm flex items-center justify-center text-white font-bold text-lg">G</div>
                  <div className="h-1.5 w-12 bg-hairline-soft rounded-full" />
                </div>
                <div className="w-28 h-28 bg-canvas rounded-2xl shadow-sm border border-hairline flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-[#000000] shadow-sm flex items-center justify-center text-white font-bold text-lg">𝕏</div>
                  <div className="h-1.5 w-12 bg-hairline-soft rounded-full" />
                </div>
                <div className="w-28 h-28 bg-canvas rounded-2xl shadow-sm border border-hairline flex flex-col items-center justify-center gap-3 translate-y-6 transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2] shadow-sm flex items-center justify-center text-white font-bold text-lg">in</div>
                  <div className="h-1.5 w-12 bg-hairline-soft rounded-full" />
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-xl font-semibold text-ink">The Fragmentation Tax</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                Running campaigns on Meta, Google, TikTok, and LinkedIn requires separate logins, dashboards, and expertise — multiplying complexity for every platform added.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
