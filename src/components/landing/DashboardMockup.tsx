export default function DashboardMockup() {
  return (
    <section className="relative -mt-16 sm:-mt-24 px-6 lg:px-8 z-20">
      <div className="mx-auto max-w-6xl rounded-2xl bg-canvas p-2 sm:p-4 border border-canvas-soft shadow-[0_24px_48px_-8px_rgba(0,0,0,0.05)]">
        <div className="rounded-xl bg-canvas-soft border border-canvas-soft overflow-hidden">

          <div className="h-14 border-b border-canvas-soft bg-canvas flex items-center px-6 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-mute/30" />
              <div className="w-3 h-3 rounded-full bg-mute/30" />
              <div className="w-3 h-3 rounded-full bg-mute/30" />
            </div>
            <div className="h-7 w-48 bg-canvas-soft rounded-md" />
          </div>

          <div className="p-8 bg-canvas">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight text-ink">Overview</h2>
              <div className="h-10 w-32 bg-primary rounded-xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-canvas-soft rounded-xl p-6 border border-canvas-soft">
                <div className="text-sm font-normal text-ink/70 mb-2">Total Creators</div>
                <div className="text-3xl font-bold tracking-tight text-ink">4,208</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-primary-pale px-2 py-0.5 text-xs font-normal text-positive-deep">
                    +12%
                  </span>
                  <span className="text-xs font-normal text-ink/50">vs last month</span>
                </div>
              </div>
              
              <div className="bg-canvas-soft rounded-xl p-6 border border-canvas-soft">
                <div className="text-sm font-normal text-ink/70 mb-2">Active Campaigns</div>
                <div className="text-3xl font-bold tracking-tight text-ink">14</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-canvas px-2 py-0.5 text-xs font-normal text-ink">
                    Stable
                  </span>
                </div>
              </div>

              <div className="bg-canvas-soft rounded-xl p-6 border border-canvas-soft">
                <div className="text-sm font-normal text-ink/70 mb-2">Reply Rate</div>
                <div className="text-3xl font-bold tracking-tight text-ink">38.4%</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-primary-pale px-2 py-0.5 text-xs font-normal text-positive-deep">
                    +4.2%
                  </span>
                  <span className="text-xs font-normal text-ink/50">vs last month</span>
                </div>
              </div>

              <div className="bg-primary-pale rounded-xl p-6 border border-primary-neutral">
                <div className="text-sm font-normal text-ink/70 mb-2">Interested</div>
                <div className="text-3xl font-bold tracking-tight text-ink">142</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-primary px-2 py-0.5 text-xs font-normal text-ink">
                    Action needed
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 h-48 bg-canvas-soft rounded-xl border border-canvas-soft flex items-center justify-center">
              <div className="text-sm font-normal text-ink/50">Campaign Analytics Chart</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
