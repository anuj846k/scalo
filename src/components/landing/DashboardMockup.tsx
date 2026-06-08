export default function DashboardMockup() {
  return (
    <section className="relative -mt-16 sm:-mt-24 px-6 lg:px-8 z-20">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-2 sm:p-4 border border-gray-100 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.05)]">
        <div className="rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">

          <div className="h-14 border-b border-gray-100 bg-white flex items-center px-6 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <div className="w-3 h-3 rounded-full bg-gray-200" />
            </div>
            <div className="h-7 w-48 bg-gray-50 rounded-md" />
          </div>

          <div className="p-8 bg-white">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h2>
              <div className="h-10 w-32 bg-primary rounded-xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm font-normal text-gray-500 mb-2">Total Creators</div>
                <div className="text-3xl font-semibold tracking-tight text-gray-900">4,208</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-blue-50 px-2 py-0.5 text-xs font-normal text-green-700">
                    +12%
                  </span>
                  <span className="text-xs font-normal text-gray-400">vs last month</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm font-normal text-gray-500 mb-2">Active Campaigns</div>
                <div className="text-3xl font-semibold tracking-tight text-gray-900">14</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-white px-2 py-0.5 text-xs font-normal text-gray-900">
                    Stable
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm font-normal text-gray-500 mb-2">Reply Rate</div>
                <div className="text-3xl font-semibold tracking-tight text-gray-900">38.4%</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-blue-50 px-2 py-0.5 text-xs font-normal text-green-700">
                    +4.2%
                  </span>
                  <span className="text-xs font-normal text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="text-sm font-normal text-gray-500 mb-2">Interested</div>
                <div className="text-3xl font-semibold tracking-tight text-gray-900">142</div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-pill bg-primary px-2 py-0.5 text-xs font-normal text-gray-900">
                    Action needed
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
              <div className="text-sm font-normal text-gray-400">Campaign Analytics Chart</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
