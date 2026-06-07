import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-ink py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-canvas sm:text-5xl">
          You will never log into Meta Ads Manager separately again.
        </h2>
        <p className="mt-6 text-lg text-steel max-w-2xl mx-auto">
          Stop waiting 48 hours for an agency to pull a failing ad. Stop paying percentages that grow as you scale. Start running ads intelligently.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-green px-8 text-base font-medium text-primary transition-colors hover:bg-brand-green-deep"
          >
            Create your account
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-steel px-8 text-base font-medium text-canvas transition-colors hover:bg-slate"
          >
            Log in to Scalo
          </Link>
        </div>
      </div>
    </section>
  );
}
