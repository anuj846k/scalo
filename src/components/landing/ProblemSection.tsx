import Image from 'next/image';

export default function ProblemSection() {
  return (
    <section className="relative bg-white py-20 px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
            Creator outreach is{' '}
            <span className="text-[#3a04ff] italic">chaos.</span>
          </h2>
          <p className="mt-2 text-lg font-normal text-gray-600 max-w-3xl mx-auto">
            Spreadsheets, Notion boards, and manual DMs don't scale. Managing
            creator partnerships is currently a disorganized mess of forgotten
            follow-ups and unread messages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-3 relative bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col border border-gray-200 h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                No Creator CRM
              </h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Most teams use Google Sheets, Notion, or Airtable. Scalo
                replaces them with a dedicated creator database, outreach
                history, campaign assignments, and relationship tracking.
              </p>
            </div>

            <div className="absolute -bottom-8 -right-8 w-[85%] sm:w-[75%] rounded-tl-2xl shadow-2xl border-t border-l border-gray-200 bg-white overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:-translate-x-2">
              <Image
                src="/landing/excel.png"
                width={500}
                height={500}
                alt="excel"
                className="w-full h-auto object-cover object-top-left"
              />
            </div>
          </div>

          <div className="lg:col-span-3 relative bg-blue-50/50 rounded-3xl overflow-hidden flex flex-col border border-blue-100 transition-all h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                Spammy DMs
              </h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Creators ignore generic, copy-pasted outreach. Scalo's AI
                analyzes creator content to write hyper-personalized messages
                that actually get replies, at scale.
              </p>
            </div>

            <div className="p-6">
              <div className="w-full h-64 border rounded-2xl bg-gray-100 overflow-hidden p-4">
                <div className="absolute w-[55%] sm:w-[55%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image
                    src="/logos/logo.svg"
                    alt="spam"
                    width="20"
                    height="20"
                  />
                  Drafted message for Alex Tech.
                </div>
                <div className="absolute bottom-35 right-10 w-[55%] sm:w-[55%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image
                    src="/logos/logo.svg"
                    alt="spam"
                    width="20"
                    height="20"
                  />
                  Why is Alex a good fit?
                </div>
                <div className="absolute bottom-20 w-[60%] sm:w-[60%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image
                    src="/logos/logo.svg"
                    alt="spam"
                    width="20"
                    height="20"
                  />
                  His travel content matches engagement goals.
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/60 p-1.5 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div className="flex-1 text-[13px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    Ask Scalo AI
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#3a04ff] flex items-center justify-center text-white shadow-md hover:bg-[#3a04ff]/90 transition-colors cursor-pointer shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-0.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col border border-gray-200 h-[450px]">
            <div className="absolute top-0 w-full h-[60%] pointer-events-none">
              <Image
                src="/landing/card3.png"
                alt="card3"
                fill
                className="object-cover object-center rounded-3xl p-1"
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#F9FAFB]/80 via-transparent to-[#F9FAFB] rounded-2xl"></div>
            </div>
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%] mt-auto">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                Follow-Up Management
              </h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Never drop a conversation again. Scalo automatically tracks
                contacted creators, pending responses, and follow-up schedules.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col border border-gray-200 h-[450px]">
            <div className="absolute top-0 w-full h-full pointer-events-none">
              <Image
                src="/landing/card5.png"
                alt="card3"
                fill
                className="object-cover object-center rounded-3xl p-1"
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#F9FAFB]/80 via-transparent to-[#F9FAFB] rounded-2xl"></div>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-[#2f62ff] rounded-3xl overflow-hidden flex flex-col h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-white tracking-tight">
                Instant Reporting
              </h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-white/70">
                Agencies can instantly see reply rates, campaign performance,
                interested creators, and conversion metrics without manual data
                entry.
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[42%] right-6 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-10 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-purple-200 to-purple-500 shadow-xs p-2 shrink-0">
                  <Image
                    src="/landing/growth.png"
                    alt="growth"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">
                    12%
                  </span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">
                    Reply Rate
                  </span>
                </div>
              </div>

              <div className="absolute top-[60%] left-6 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-20 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-orange-200 to-orange-500 shadow-xs p-2 shrink-0">
                  <Image
                    src="/landing/insights.png"
                    alt="insights"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">
                    24
                  </span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">
                    Interested
                  </span>
                </div>
              </div>

              <div className="absolute bottom-10 right-8 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-30 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-red-200 to-red-500 shadow-xs p-2 shrink-0">
                  <Image
                    src="/landing/advert.png"
                    alt="advertisment"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">
                    1.2k
                  </span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">
                    Link Clicks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
