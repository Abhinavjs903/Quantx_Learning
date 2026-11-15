"use client";

import { useState } from "react";
import Link from "next/link";
import type { Topic } from "@/types";
import TopicManagementTab from "@/components/admin/TopicManagementTab";

interface PYQItem {
  id: string;
  year: number;
  examType: string;
  fileUrl: string;
  topicTags?: string | null;
  topics?: {
    topic: Topic;
  }[];
}

interface SubjectData {
  id: string;
  name: string;
  code?: string | null;
  semester?: {
    id: string;
    number: number;
    course?: {
      id: string;
      name: string;
      code?: string | null;
    };
  };
  topics: Topic[];
  pyqs: PYQItem[];
}

export default function SubjectAdminClient({
  subject,
}: {
  subject: SubjectData;
}) {
  const [activeTab, setActiveTab] = useState<"topics" | "overview" | "pyqs">(
    "topics"
  );
  const [topics, setTopics] = useState<Topic[]>(subject.topics);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          href="/admin"
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Subjects
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {subject.name}
        </span>
      </nav>

      {/* Subject Header Card */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {subject.name}
              </h1>
              {subject.code && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {subject.code}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {subject.semester?.course?.name || "Course"} • Semester{" "}
              {subject.semester?.number || "1"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/pyqs?subjectId=${subject.id}`}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              View Student PYQ Browser
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("topics")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "topics"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            Topics ({topics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pyqs")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "pyqs"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            PYQ Papers ({subject.pyqs?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            Subject Overview
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "topics" && (
        <TopicManagementTab
          subjectId={subject.id}
          initialTopics={topics}
          onTopicsUpdated={setTopics}
        />
      )}

      {activeTab === "pyqs" && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                PYQs for {subject.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Select a PYQ to tag its questions with topics for the topic
                frequency analyzer.
              </p>
            </div>
          </div>

          {!subject.pyqs || subject.pyqs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              No PYQ records uploaded for this subject yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {subject.pyqs.map((pyq) => {
                const pyqTopics = pyq.topics?.map((qt) => qt.topic) || [];
                return (
                  <div
                    key={pyq.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 px-2 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {pyq.year} — {pyq.examType.replace("_", " ")}
                        </span>
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {pyqTopics.length}{" "}
                          {pyqTopics.length === 1 ? "tag" : "tags"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {pyqTopics.length > 0 ? (
                          pyqTopics.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              #{t.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 italic">
                            No topics tagged yet
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/pyqs/${pyq.id}`}
                        className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 shadow-xs"
                      >
                        Tag Questions →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Subject Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Subject Name
              </dt>
              <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                {subject.name}
              </dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Subject Code
              </dt>
              <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                {subject.code || "N/A"}
              </dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Course & Semester
              </dt>
              <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                {subject.semester?.course?.name} • Semester{" "}
                {subject.semester?.number}
              </dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Total Topics Defined
              </dt>
              <dd className="mt-1 font-semibold text-blue-600 dark:text-blue-400">
                {topics.length} topics
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
