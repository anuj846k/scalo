export default function DashboardMockup() {
  return (
    <section className="relative -mt-16 sm:-mt-24 px-6 lg:px-8 z-20">
      <div className="mx-auto max-w-6xl rounded-xl bg-canvas p-2 border border-hairline-soft shadow-[0_24px_48px_-8px_rgba(0,0,0,0.12)]">
        <div className="rounded-lg bg-surface border border-hairline overflow-hidden">
          {/* Fake UI Header */}
          <div className="h-12 border-b border-hairline bg-canvas flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-hairline" />
              <div className="w-3 h-3 rounded-full bg-hairline" />
              <div className="w-3 h-3 rounded-full bg-hairline" />
            </div>
            <div className="h-6 w-64 bg-surface rounded-md border border-hairline-soft" />
          </div>
          {/* Fake UI Body */}
          <div className="p-8 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-8 w-48 bg-hairline-soft rounded-md" />
              <div className="h-4 w-3/4 bg-hairline-soft rounded-sm" />
              <div className="h-64 bg-canvas rounded-md border border-hairline" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-canvas rounded-md border border-hairline p-4 flex flex-col justify-center">
                <div className="text-sm text-steel mb-2">Campaign Health Score</div>
                <div className="text-4xl font-semibold text-brand-green">
                  94<span className="text-lg text-steel">/100</span>
                </div>
              </div>
              <div className="h-32 bg-canvas rounded-md border border-hairline p-4 flex flex-col justify-center">
                <div className="text-sm text-steel mb-2">Unified Engagement Score</div>
                <div className="text-4xl font-semibold text-ink">
                  78<span className="text-lg text-steel">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
