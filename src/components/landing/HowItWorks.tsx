export default function HowItWorks() {
  const steps = [
    {
      stage: "NOT_CONTACTED",
      title: "Import & Organize",
      desc: "Build your creator database. Tag, categorize, and assign creators to specific campaigns.",
    },
    {
      stage: "CONTACTED",
      title: "AI Personalized Outreach",
      desc: "Scalo reads the creator's bio and niche to draft highly relevant DMs and emails automatically.",
    },
    {
      stage: "REPLIED",
      title: "Automated Classification",
      desc: "Incoming replies are instantly read by AI and tagged as 'Interested', 'Follow-Up Needed', or 'Not Interested'.",
    },
    {
      stage: "NEGOTIATING",
      title: "Close the Partnership",
      desc: "Manage deliverables, track pricing discussions, and move creators to 'Closed' without losing context.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-canvas-soft py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-ink">
            The Outreach Pipeline.
          </h2>
          <p className="mt-4 text-lg font-normal text-ink/70 max-w-2xl mx-auto">
            From first touch to signed partnership, managed seamlessly in one place.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">

          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-canvas-soft border-l-2 border-dashed border-mute/30 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="hidden md:flex shrink-0 w-14 h-14 rounded-full bg-primary-pale border border-primary-neutral items-center justify-center text-base font-semibold text-ink z-10">
                  {index + 1}
                </div>
                <div className="bg-canvas border border-canvas-soft rounded-xl p-8 flex-1 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="inline-block mb-3 px-2 py-1 bg-canvas-soft rounded-md text-xs font-semibold tracking-wider text-mute">
                    {step.stage}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-3 text-base font-normal text-ink/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
