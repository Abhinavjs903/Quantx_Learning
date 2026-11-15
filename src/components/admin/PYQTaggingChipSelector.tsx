"use client";

import { useState, useRef, useEffect } from "react";
import type { Topic } from "@/types";
import { updatePYQTags, createSubjectTopic } from "@/services";

interface PYQTaggingChipSelectorProps {
  pyqId: string;
  subjectId: string;
  initialAssignedTopics: Topic[];
  allSubjectTopics: Topic[];
  onTagsUpdated?: (updatedTopics: Topic[]) => void;
}

export default function PYQTaggingChipSelector({
  pyqId,
  subjectId,
  initialAssignedTopics,
  allSubjectTopics,
  onTagsUpdated,
}: PYQTaggingChipSelectorProps) {
  const [assignedTopics, setAssignedTopics] = useState<Topic[]>(
    initialAssignedTopics
  );
  const [availableTopics, setAvailableTopics] =
    useState<Topic[]>(allSubjectTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter available topics that are not yet selected
  const assignedIds = new Set(assignedTopics.map((t) => t.id));
  const unassignedTopics = availableTopics.filter(
    (t) => !assignedIds.has(t.id)
  );

  const matchingTopics = unassignedTopics.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const exactMatchExists = availableTopics.some(
    (t) => t.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const persistTags = async (nextTopics: Topic[]) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await updatePYQTags(
        pyqId,
        nextTopics.map((t) => t.id)
      );

      if (res.success && res.data) {
        setAssignedTopics(res.data.topics);
        onTagsUpdated?.(res.data.topics);
        setStatusMessage({
          type: "success",
          text: "Topic tags saved successfully",
        });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update tags",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error while updating tags",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTopic = (topic: Topic) => {
    if (assignedIds.has(topic.id)) return;
    const next = [...assignedTopics, topic];
    setAssignedTopics(next);
    setSearchQuery("");
    setIsOpen(false);
    persistTags(next);
  };

  const handleRemoveTopic = (topicId: string) => {
    const next = assignedTopics.filter((t) => t.id !== topicId);
    setAssignedTopics(next);
    persistTags(next);
  };

  const handleCreateAndTag = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsCreatingTopic(true);
    setStatusMessage(null);

    try {
      const res = await createSubjectTopic(subjectId, trimmed);
      if (res.success && res.data) {
        const newTopic = res.data;
        const nextAvailable = [...availableTopics, newTopic].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const nextAssigned = [...assignedTopics, newTopic];

        setAvailableTopics(nextAvailable);
        setAssignedTopics(nextAssigned);
        setSearchQuery("");
        setIsOpen(false);

        await persistTags(nextAssigned);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Could not create new topic",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Error creating topic",
      });
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !searchQuery && assignedTopics.length > 0) {
      // Remove last tag when backspace is pressed in empty input
      const last = assignedTopics[assignedTopics.length - 1];
      handleRemoveTopic(last.id);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matchingTopics.length > 0) {
        handleAddTopic(matchingTopics[0]);
      } else if (searchQuery.trim() && !exactMatchExists) {
        handleCreateAndTag();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`rounded-lg p-3 text-xs font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
          }`}
        >
          {statusMessage.type === "success" ? "✓" : "⚠️"} {statusMessage.text}
        </div>
      )}

      {/* Tag Chips Container and Search-as-you-type Input */}
      <div className="relative">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Topic Tags ({assignedTopics.length} tagged)
        </label>

        <div
          onClick={() => {
            inputRef.current?.focus();
            setIsOpen(true);
          }}
          className="min-h-12 w-full rounded-lg border border-zinc-300 bg-white p-2 text-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 flex flex-wrap items-center gap-2 cursor-text transition-all"
        >
          {/* Tag Chips */}
          {assignedTopics.map((topic) => (
            <span
              key={topic.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700/40 transition-all hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <span>#{topic.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTopic(topic.id);
                }}
                disabled={isSaving}
                title={`Remove ${topic.name}`}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-700 hover:bg-blue-200/70 hover:text-blue-900 dark:text-blue-300 dark:hover:bg-blue-800/80 dark:hover:text-blue-100"
              >
                ✕
              </button>
            </span>
          ))}

          {/* Search Input */}
          <div className="flex-1 min-w-[160px] relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                assignedTopics.length === 0
                  ? "Search topics to tag or type new topic..."
                  : "Add more topics..."
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              disabled={isSaving || isCreatingTopic}
              className="w-full bg-transparent p-1 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Saving Indicator */}
          {isSaving && (
            <span className="text-xs text-zinc-400 animate-pulse ml-auto pr-2">
              Saving...
            </span>
          )}
        </div>

        {/* Search-As-You-Type Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            {matchingTopics.length > 0 ? (
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Existing Subject Topics
                </div>
                {matchingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleAddTopic(topic)}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-200 dark:hover:bg-zinc-700/50 dark:hover:text-blue-400"
                  >
                    <span className="font-medium">#{topic.name}</span>
                    <span className="text-xs text-zinc-400">Click to tag</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3.5 py-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                {searchQuery
                  ? `No existing topic named "${searchQuery}"`
                  : "All existing topics are already tagged"}
              </div>
            )}

            {/* Quick create and tag option */}
            {searchQuery.trim() && !exactMatchExists && (
              <div className="border-t border-zinc-100 dark:border-zinc-700/60 p-1">
                <button
                  type="button"
                  onClick={handleCreateAndTag}
                  disabled={isCreatingTopic}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-zinc-700/50 disabled:opacity-50"
                >
                  <span>➕</span>
                  <span>
                    {isCreatingTopic
                      ? "Creating..."
                      : `Create and tag "${searchQuery.trim()}"`}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          Type to search existing subject topics or create a new topic on the
          fly.
        </p>
        <p className="hidden sm:block">Press Backspace to remove last tag</p>
      </div>
    </div>
  );
}
