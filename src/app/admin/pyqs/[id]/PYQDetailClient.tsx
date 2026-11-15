"use client";

import { useState } from "react";
import Link from "next/link";
import type { Topic } from "@/types";
import PYQTaggingChipSelector from "@/components/admin/PYQTaggingChipSelector";

interface PYQDetailProps {
  pyq: {
    id: string;
    subjectId: string;
    year: number;
    examType: string;
    fileUrl: string;
    topicTags?: string | null;
    subject: {
      id: string;
      name: string;
      code?: string | null;
      semester?: {
        number: number;
        course?: {
          name: string;
        };
      };
    };
    topics: {
      topic: Topic;
    }[];
  };
  availableTopics: Topic[];
}

export default function PYQDetailClient({
  pyq,
  availableTopics,
}: PYQDetailProps) {
  const initialAssigned = pyq.topics?.map((qt) => qt.topic) || [];
  const [assignedTopics, setAssignedTopics] =
    useState<Topic[]>(initialAssigned);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/admin"
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Admin
        </Link>
        <span>/</span>
        <Link
          href={`/admin/subjects/${pyq.subject.id}`}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {pyq.subject.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {pyq.year} {pyq.examType.replace("_", " ")} Tagging
        </span>
      </nav>

      {/* Main Container */}
      <div className="space-y-6">
        {/* PYQ Header Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300">
                PYQ Question Paper
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {pyq.subject.name} — {pyq.year}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {pyq.subject.semester?.course?.name} • Semester{" "}
                {pyq.subject.semester?.number} • Exam Type:{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {pyq.examType.replace("_", " ")}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {pyq.fileUrl && (
                <a
                  href={pyq.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  View Paper PDF ↗
                </a>
              )}
              <Link
                href={`/admin/subjects/${pyq.subject.id}`}
                className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Back to Subject Topics
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Select Chip UI Card for Tagging */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              PYQ Question Topic Tagging
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Tag questions in this previous year paper with subject-scoped
              topics. These tags feed into the PYQ Topic Frequency Analyzer to
              calculate exam question repetition and importance.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-zinc-50/70 p-4 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
            <PYQTaggingChipSelector
              pyqId={pyq.id}
              subjectId={pyq.subject.id}
              initialAssignedTopics={assignedTopics}
              allSubjectTopics={availableTopics}
              onTagsUpdated={setAssignedTopics}
            />
          </div>

          {/* Extracted text / topicTags info */}
          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Stored Topic Tags Text
            </h3>
            <p className="mt-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded text-zinc-700 dark:text-zinc-300">
              {assignedTopics.length > 0
                ? assignedTopics.map((t) => t.name).join(", ")
                : "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
