export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight text-primary">Scalo</span>
        </div>
        <p className="text-sm font-normal text-gray-400">
          © {new Date().getFullYear()} Scalo Inc. The Creator Outreach CRM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
