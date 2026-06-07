export default function Footer() {
  return (
    <footer className="bg-canvas border-t border-hairline py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink">Scalo</span>
        </div>
        <p className="text-sm text-steel">
          © {new Date().getFullYear()} Scalo Inc. The AI CMO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
