import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              🎓 IPU Portal
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              href="/resources"
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              Study Material
            </Link>
            <Link
              href="/pyqs"
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              PYQs
            </Link>
            <Link
              href="/notices"
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              Notices
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
