import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Label for a form control. Connect it to the control with htmlFor/id.
 *
 * Usage:
 * <Label htmlFor="email">Email</Label>
 */
export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    />
  );
}
