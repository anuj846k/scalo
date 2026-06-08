import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-gray-900 py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-semibold text-white sm:text-5xl sm:font-normal sm:tracking-tight">
          Ready to scale your <span className="text-primary">creator outreach?</span>
        </h2>
        <p className="mt-6 text-lg font-normal text-gray-300 max-w-2xl mx-auto">
          Stop manually sending DMs and tracking responses in spreadsheets. Join the modern agencies using Scalo to close more creator partnerships.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white transition-colors hover:opacity-90"
          >
            Start your campaign
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-transparent border border-gray-100 px-8 text-base font-semibold text-white transition-colors hover:bg-gray-50/10"
          >
            Log in to Scalo
          </Link>
        </div>
      </div>
    </section>
  );
}
