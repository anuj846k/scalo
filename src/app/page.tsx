import { FaInstagram } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="bg-canvas-soft px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto flex max-w-5xl items-center gap-12">
          <div className="min-w-0 flex-1">
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-ink sm:text-7xl md:text-8xl">
              Instagram DM outreach,
              <br />
              actually managed.
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-body sm:text-xl">
              CRM, campaigns, and AI-powered personalization for agencies that
              run creator outreach at scale. No more spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-[24px] bg-primary px-6 text-base font-semibold text-on-primary transition-colors hover:bg-primary-active"
              >
                Get early access
              </a>
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-[24px] bg-canvas px-6 text-base font-semibold text-ink transition-colors hover:bg-canvas-soft"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="hidden shrink-0 md:block">
            <svg aria-hidden="true" className="absolute w-0 h-0">
              <defs>
                <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f58529" />
                  <stop offset="30%" stopColor="#dd2a7b" />
                  <stop offset="60%" stopColor="#8134af" />
                  <stop offset="100%" stopColor="#515bd4" />
                </linearGradient>
              </defs>
            </svg>
            <FaInstagram
              size={260}
              style={{ fill: "url(#igGrad)" }}
              className="drop-shadow-[0_8px_24px_rgba(221,42,123,0.35)]"
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black leading-tight text-ink sm:text-4xl">The pain</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[24px] bg-canvas-soft p-6">
              <h3 className="text-lg font-semibold text-ink">No CRM for creator outreach</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Sales has Salesforce. Agencies have Google Sheets. You can't see who
                was contacted, who replied, who needs a follow-up, or who converted.
              </p>
            </div>
            <div className="rounded-[24px] bg-canvas-soft p-6">
              <h3 className="text-lg font-semibold text-ink">Managing multiple accounts</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                5 Instagram accounts, 10 campaigns, 3 VAs. Sessions expire, logins are
                shared, messages go out from the wrong account. Chaotic.
              </p>
            </div>
            <div className="rounded-[24px] bg-primary-pale p-6">
              <h3 className="text-lg font-semibold text-ink">Personalization at scale</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                &ldquo;Hey, loved your content&rdquo; to 1000 creators doesn't cut it. AI-generated
                first lines based on real profile context — without the manual work.
              </p>
            </div>
            <div className="rounded-[24px] bg-canvas-soft p-6">
              <h3 className="text-lg font-semibold text-ink">Follow-ups fall through</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Most deals happen on follow-up. But VAs forget. Day 1: DM sent.
                Day 7: should follow up. Nobody remembers. Money is lost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-soft px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black leading-tight text-ink sm:text-4xl">What you get</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-[24px] bg-canvas p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                CRM
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">Creator CRM</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Track every creator through stages: Not Contacted, Contacted, Replied,
                Interested, Negotiating, Closed. No more guessing.
              </p>
            </div>
            <div className="rounded-[24px] bg-canvas p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                AI
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">AI messaging</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Extract Instagram profile context and generate personalized outreach.
                Set templates with variables like {"{creator_name}"} and {"{niche}"}.
              </p>
            </div>
            <div className="rounded-[24px] bg-canvas p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                DS
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">Dashboard</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Reply rates, campaign health, high-intent leads. Real answers to
                "how many creators replied?" without digging through chats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
