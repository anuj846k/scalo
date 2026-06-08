import Link from "next/link";
import { getUser } from "@/lib/auth-utils";
import Image from "next/image";

export default async function Navbar() {
  const user = await getUser();

  return (
    // <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
    //   <div className="mx-auto max-w-5xl px-6 lg:px-8">
    //     <div className="flex items-center justify-between h-16">
    //       <div className="shrink-0">
    //         <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-900 hover:text-gray-600 transition-colors">
    //           Scalo
    //         </Link>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         {user ? (
    //           <Link
    //             href="/dashboard"
    //             className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
    //           >
    //             Dashboard
    //           </Link>
    //         ) : (
    //           <>
    //             <Link
    //               href="/login"
    //               className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
    //             >
    //               Log in
    //             </Link>
    //             <Link
    //               href="/signup"
    //               className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
    //             >
    //               Register
    //             </Link>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </nav>

    <nav className="fixed top-6 flex w-full items-center justify-center max-w-full z-50">

      <div className="flex w-[40%] items-center justify-between px-4 py-2 rounded-2xl border border-[#e4e4ff] bg-white">
        <div className="flex items-center gap-3">
          <Image src="/logos/logo.svg" alt="Scalo Logo" width={50} height={50} />
          <span className="text-2xl font-bold tracking-tight text-gray-900">Scalo</span>
        </div>
        <div className="flex gap-6">
          <p className="font-medium cursor-pointer hover:text-gray-600 transition-colors">Product</p>
          <p className="font-medium cursor-pointer hover:text-gray-600 transition-colors">Features</p>
          <p className="font-medium cursor-pointer hover:text-gray-600 transition-colors">Pricing</p>
        </div>


        <div className="flex gap-2">
          <Link href="/login" className="cursor-pointer hover:text-gray-600 transition-colors border border-[#e4e4ff] bg-white p-2 px-5 rounded-xl shadow-xs">
            Sign in</Link>
          <Link href="/signup" className="bg-linear-to-b from-[#3a04ff] to-[#8b5cf6] text-white p-2 px-5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all">
            Get Started</Link>
        </div>
      </div>

    </nav>
  );
}
