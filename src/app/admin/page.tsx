import Link from "next/link";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | IPU Student Portal",
  description: "Academic administration and PYQ topic tagging.",
};

export const dynamic = "force-dynamic";

interface SubjectWithCounts {
  id: string;
  name: string;
  code?: string | null;
  semester?: {
    number: number;
    course?: {
      name: string;
    } | null;
  } | null;
  _count?: {
    topics?: number;
    pyqs?: number;
  };
}

interface PYQSummary {
  id: string;
  year: number;
  examType: string;
  subject?: {
    name: string;
  } | null;
  topics?: {
    topic: {
      name: string;
    };
  }[];
}

export default async function AdminPage() {
  let subjects: SubjectWithCounts[] = [];
  let pyqs: PYQSummary[] = [];

  try {
    subjects = await prisma.subject.findMany({
      include: {
        semester: {
          include: {
            course: true,
          },
        },
        _count: {
          select: {
            topics: true,
            pyqs: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    pyqs = await prisma.pYQ.findMany({
      include: {
        subject: true,
        topics: {
          include: {
            topic: true,
          },
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load admin data:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
          Admin Control Center
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          PYQ Topic Tagging & Subject Management
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Manage subject topics and tag PYQ questions to power the PYQ Topic
          Frequency Analyzer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Subject List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Subjects & Topic Lists
              </h2>
              <span className="text-xs text-zinc-500">
                {subjects.length}{" "}
                {subjects.length === 1 ? "Subject" : "Subjects"}
              </span>
            </div>

            {subjects.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No subjects found in the database.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 px-2 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/subjects/${sub.id}`}
                          className="font-medium text-sm text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                        >
                          {sub.name}
                        </Link>
                        {sub.code && (
                          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {sub.code}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {sub.semester?.course?.name} • Semester{" "}
                        {sub.semester?.number}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          {sub._count?.topics || 0}
                        </span>{" "}
                        topics •{" "}
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          {sub._count?.pyqs || 0}
                        </span>{" "}
                        PYQs
                      </span>

                      <Link
                        href={`/admin/subjects/${sub.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 shadow-xs"
                      >
                        Manage Topics →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent PYQs for Quick Tagging */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Recent PYQs to Tag
            </h2>

            {pyqs.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No PYQs available to tag.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {pyqs.map((p) => {
                  const topicCount = p.topics?.length || 0;
                  return (
                    <div key={p.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {p.subject?.name} ({p.year})
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                            topicCount > 0
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {topicCount} {topicCount === 1 ? "tag" : "tags"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                          {p.examType.replace("_", " ")}
                        </span>
                        <Link
                          href={`/admin/pyqs/${p.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                          Tag questions →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
