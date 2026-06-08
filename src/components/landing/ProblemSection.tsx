export default function ProblemSection() {
  return (
    <section className="relative bg-white py-24 sm:py-32 px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-semibold text-gray-900">
            Creator outreach is <span className="text-gray-400 line-through">chaos</span>.
          </h2>
          <p className="mt-6 text-lg font-normal text-gray-600 max-w-2xl mx-auto">
            Spreadsheets, Notion boards, and manual DMs don't scale. Managing creator partnerships is currently a disorganized mess of forgotten follow-ups and unread messages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col border border-gray-100 transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center w-full overflow-hidden p-6">
              <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 opacity-50 flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded-sm" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-sm" />
                <div className="h-4 w-5/6 bg-gray-100 rounded-sm" />
                <div className="h-4 w-full bg-gray-100 rounded-sm" />
                <div className="h-4 w-2/3 bg-gray-100 rounded-sm" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-gray-300 rotate-[-15deg]">
                SPREADSHEET HELL
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">No Creator CRM</h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-gray-500">
                Most teams use Google Sheets, Notion, or Airtable. Scalo replaces them with a dedicated creator database, outreach history, campaign assignments, and relationship tracking.
              </p>
            </div>
          </div>


          <div className="bg-blue-50 rounded-xl overflow-hidden flex flex-col border border-blue-100 transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center w-full overflow-hidden p-6">
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-sm font-normal text-gray-400 mb-2">Manual Outreach</div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs font-normal text-gray-500 mb-4">
                  "Hey, loved your content!"
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  AI Personalized
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-xs font-normal text-gray-900">
                  "Loved your recent review of the XYZ camera. I think your audience would appreciate our new..."
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Personalization At Scale</h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-gray-500">
                Stop sending generic "loved your content" DMs. Scalo generates highly personalized outreach using the creator's bio, niche, and campaign context.
              </p>
            </div>
          </div>


          <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col border border-gray-100 transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center w-full overflow-hidden p-6">
              <div className="w-full space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center opacity-40">
                  <div className="text-xs font-medium text-gray-900">@tech_reviewer</div>
                  <div className="text-xs font-normal text-green-600">Replied</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-primary shadow-sm flex justify-between items-center transform scale-105">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">@lifestyle_creator</div>
                    <div className="text-xs font-normal text-gray-400 mt-1">Sent 3 days ago</div>
                  </div>
                  <div className="bg-warning/20 text-warning-deep px-2 py-1 rounded-md text-xs font-semibold">
                    Follow up due
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center opacity-40">
                  <div className="text-xs font-medium text-gray-900">@fitness_guru</div>
                  <div className="text-xs font-normal text-gray-400">Not contacted</div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Follow-Up Management</h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-gray-500">
                Never drop a conversation again. Scalo automatically tracks contacted creators, pending responses, and follow-up schedules.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl overflow-hidden flex flex-col border border-gray-800 transition-transform hover:-translate-y-1">
            <div className="h-64 relative flex items-center justify-center w-full overflow-hidden p-6">
              <div className="grid grid-cols-2 gap-4 w-full h-full pb-4">
                <div className="bg-gray-50/10 rounded-xl flex flex-col justify-end p-4">
                  <div className="text-primary text-3xl font-semibold tracking-tight">12%</div>
                  <div className="text-gray-300 text-xs font-normal">Reply Rate</div>
                </div>
                <div className="bg-gray-50/10 rounded-xl flex flex-col justify-end p-4">
                  <div className="text-primary text-3xl font-semibold tracking-tight">24</div>
                  <div className="text-gray-300 text-xs font-normal">Interested</div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              <h3 className="text-lg font-semibold text-primary">Instant Reporting</h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-gray-300">
                Agencies can instantly see reply rates, campaign performance, interested creators, and conversion metrics without manual data entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
