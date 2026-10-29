"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Accessible modal dialog using the native HTML <dialog> element.
 *
 * Usage:
 * const [open, setOpen] = useState(false);
 * <Button onClick={() => setOpen(true)}>Open dialog</Button>
 * <Dialog open={open} onClose={() => setOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 *   <Button onClick={() => setOpen(false)}>Close</Button>
 * </Dialog>
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className = "",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Close when the user clicks the backdrop, not the dialog content.
        if (event.target === dialogRef.current) onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
