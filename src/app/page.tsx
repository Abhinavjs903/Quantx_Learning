import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
          Open Source Academic Platform
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
          Everything an IPU student needs for academics
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Access curated study material, previous year question papers (PYQs),
          question banks, and important university notices in one centralized
          portal.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/resources"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Explore Study Material
          </Link>
          <Link
            href="/pyqs"
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Browse PYQs
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl mb-2">📚</div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Study Material
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Organized notes, PDFs, PPTs, reference books, and lab manuals by
              course, semester, and unit.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl mb-2">📝</div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Previous Year Papers
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Access previous years exam papers with filtered search by course,
              semester, and year.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl mb-2">📢</div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Official Notices
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Stay updated with academic calendars, exam date-sheets, and
              university announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
