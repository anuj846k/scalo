import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-ink py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-black text-canvas sm:text-5xl sm:font-normal sm:tracking-tight">
          Ready to scale your <span className="text-primary">creator outreach?</span>
        </h2>
        <p className="mt-6 text-lg font-normal text-canvas-soft/80 max-w-2xl mx-auto">
          Stop manually sending DMs and tracking responses in spreadsheets. Join the modern agencies using Scalo to close more creator partnerships.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-on-primary transition-colors hover:bg-primary-active"
          >
            Start your campaign
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-transparent border border-canvas-soft px-8 text-base font-semibold text-canvas transition-colors hover:bg-canvas-soft/10"
          >
            Log in to Scalo
          </Link>
        </div>
      </div>
    </section>
  );
}
