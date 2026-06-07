export default function HowItWorks() {
  const steps = [
    {
      title: "1. The Brief",
      desc: "Input your objective, budget, and brand guidelines in plain language. Scalo's AI immediately analyses it to recommend platform mix and strategy.",
    },
    {
      title: "2. Creative Generation",
      desc: "Scalo generates multiple ad copy and image/video variations instantly, fully adapted to every platform format (Feed, Stories, Reels).",
    },
    {
      title: "3. Multi-Platform Launch",
      desc: "Approved ads go live simultaneously across Meta, Google, TikTok, and LinkedIn from a single click. No manual uploads.",
    },
    {
      title: "4. Autonomous Decisions",
      desc: "Scalo evaluates every ad continuously using the Unified Engagement Score. It scales winners, mutates underperformers, and pauses losers in real time.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-canvas py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How Scalo works.
          </h2>
          <p className="mt-4 text-lg text-steel max-w-2xl mx-auto">
            From brief to live optimization without a single agency email.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-hairline hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="hidden md:flex shrink-0 w-14 h-14 rounded-full bg-surface border border-hairline items-center justify-center text-xl font-bold text-brand-green z-10">
                  {index + 1}
                </div>
                <div className="bg-surface border border-hairline-soft rounded-xl p-8 flex-1 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-steel leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
