"use client";

import { useState } from "react";
import type { Topic } from "@/types";
import { createSubjectTopic, updateTopic, deleteTopic } from "@/services";

interface TopicManagementTabProps {
  subjectId: string;
  initialTopics: Topic[];
  onTopicsUpdated?: (updated: Topic[]) => void;
}

export default function TopicManagementTab({
  subjectId,
  initialTopics,
  onTopicsUpdated,
}: TopicManagementTabProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editing state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState("");
  const [isEditingSaving, setIsEditingSaving] = useState(false);

  // Deleting state
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmed = newTopicName.trim();
    if (!trimmed) {
      setError("Topic name cannot be empty");
      return;
    }

    // Check duplicate locally
    const duplicate = topics.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError(`Topic "${trimmed}" already exists for this subject`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createSubjectTopic(subjectId, trimmed);
      if (res.success && res.data) {
        const next = [...topics, res.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setTopics(next);
        onTopicsUpdated?.(next);
        setNewTopicName("");
        setSuccessMessage(`Topic "${trimmed}" created successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(res.error || "Failed to create topic");
      }
    } catch {
      setError("An unexpected error occurred while creating topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditingTopicName(topic.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingTopicId(null);
    setEditingTopicName("");
  };

  const handleSaveEdit = async (topicId: string) => {
    const trimmed = editingTopicName.trim();
    if (!trimmed) {
      setError("Topic name cannot be empty");
      return;
    }

    const duplicate = topics.some(
      (t) => t.id !== topicId && t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError(`Topic "${trimmed}" already exists for this subject`);
      return;
    }

    setIsEditingSaving(true);
    setError(null);

    try {
      const res = await updateTopic(topicId, trimmed);
      if (res.success && res.data) {
        const next = topics
          .map((t) => (t.id === topicId ? res.data! : t))
          .sort((a, b) => a.name.localeCompare(b.name));
        setTopics(next);
        onTopicsUpdated?.(next);
        setEditingTopicId(null);
        setEditingTopicName("");
        setSuccessMessage("Topic updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(res.error || "Failed to update topic");
      }
    } catch {
      setError("Failed to update topic");
    } finally {
      setIsEditingSaving(false);
    }
  };

  const handleDelete = async (topicId: string, topicName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the topic "${topicName}"? This will untag any PYQ questions associated with it.`
    );
    if (!confirmed) return;

    setDeletingTopicId(topicId);
    setError(null);

    try {
      const res = await deleteTopic(topicId);
      if (res.success) {
        const next = topics.filter((t) => t.id !== topicId);
        setTopics(next);
        onTopicsUpdated?.(next);
        setSuccessMessage(`Topic "${topicName}" deleted successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(res.error || "Failed to delete topic");
      }
    } catch {
      setError("Failed to delete topic");
    } finally {
      setDeletingTopicId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          ✓ {successMessage}
        </div>
      )}

      {/* Header and Add Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Subject Topics
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage the master list of topics for this subject. PYQ questions
              can be tagged with these topics.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
            {topics.length} {topics.length === 1 ? "Topic" : "Topics"} defined
          </span>
        </div>

        {/* Add Topic Input */}
        <form onSubmit={handleCreateTopic} className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Enter new topic name (e.g. Dynamic Programming, Normalization, B-Trees)..."
            value={newTopicName}
            onChange={(e) => {
              setNewTopicName(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTopicName.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-900"
          >
            {isSubmitting ? "Adding..." : "+ Add Topic"}
          </button>
        </form>
      </div>

      {/* Filter and List Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search topics in this subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 pl-9 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">
              🔍
            </span>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing {filteredTopics.length} of {topics.length} topics
          </div>
        </div>

        {/* Topics Table/List */}
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl mb-2 block">🏷️</span>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {searchQuery
                ? `No topics match "${searchQuery}"`
                : "No topics added yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? "Try a different search term or add a new topic above."
                : "Add topics above to start organizing and tagging PYQs for this subject."}
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredTopics.map((topic) => {
              const isEditing = editingTopicId === topic.id;
              const isDeleting = deletingTopicId === topic.id;
              const questionCount = topic._count?.questions ?? 0;

              return (
                <div
                  key={topic.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 px-2 rounded-lg transition-colors"
                >
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingTopicName}
                        onChange={(e) => setEditingTopicName(e.target.value)}
                        className="flex-1 rounded-md border border-blue-500 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none dark:bg-zinc-800 dark:text-zinc-100"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(topic.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(topic.id)}
                        disabled={isEditingSaving || !editingTopicName.trim()}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                      >
                        {isEditingSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                          #
                        </span>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                            {topic.name}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            Tagged in {questionCount}{" "}
                            {questionCount === 1 ? "PYQ" : "PYQs"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => startEdit(topic)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(topic.id, topic.name)}
                          disabled={isDeleting}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
