import Link from "next/link";
import { getUser } from "@/lib/auth-utils";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-canvas/80 backdrop-blur-md border-b border-canvas-soft z-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-tight text-ink hover:text-ink/80 transition-colors">
              Scalo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-active"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-ink hover:text-ink/80 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-active"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
