import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} IPU Student Portal. Released under MIT
          License.
        </p>
        <div className="flex gap-6">
          <Link
            href="/about"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            About
          </Link>
          <a
            href="https://github.com/Abhinavjs903/Quantx_Learning"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
