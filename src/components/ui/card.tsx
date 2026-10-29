import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Simple container for grouping related content.
 *
 * Usage:
 * <Card>
 *   <h2 className="text-lg font-semibold">Profile</h2>
 *   <p>User information goes here.</p>
 * </Card>
 */
export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    />
  );
}
