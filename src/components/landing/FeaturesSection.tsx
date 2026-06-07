export default function FeaturesSection() {
  return (
    <section id="features" className="bg-canvas py-24 sm:py-32 px-6 lg:px-8 border-y border-canvas-soft">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-ink">
            Everything you need to scale.
          </h2>
          <p className="mt-4 text-lg font-normal text-ink/70 max-w-2xl">
            Scalo replaces your spreadsheets, Notion boards, and disconnected email threads with a single platform designed specifically for creator partnerships.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-canvas-soft p-8 rounded-xl flex flex-col h-full transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary-pale text-positive-deep rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-ink">Campaign Management</h3>
            <p className="mt-3 text-sm font-normal text-ink/70 flex-1">
              Organize creators into campaigns. Track who was contacted, who replied, and who converted without ever updating a spreadsheet manually.
            </p>
          </div>


          <div className="bg-canvas-soft p-8 rounded-xl flex flex-col h-full transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-canvas text-ink rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-ink">AI Personalization</h3>
            <p className="mt-3 text-sm font-normal text-ink/70 flex-1">
              Connect your campaigns to Scalo's AI engine to generate highly contextual, personalized outreach based on creator bios and niches.
            </p>
          </div>


          <div className="bg-canvas-soft p-8 rounded-xl flex flex-col h-full transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary text-ink rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-ink">Reply Classification</h3>
            <p className="mt-3 text-sm font-normal text-ink/70 flex-1">
              Stop sifting through hundreds of emails. Scalo automatically categorizes incoming replies so your team can focus on interested creators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
