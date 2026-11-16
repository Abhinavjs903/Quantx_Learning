// Role model and pure access decisions. No framework imports, so it is
// trivially unit-testable and safe to use from both the proxy and route handlers.
// Roles mirror the `Role` enum in prisma/scheme.prisma.

export const ROLES = ["STUDENT", "MODERATOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

// Higher rank inherits everything a lower rank can do.
const RANK: Record<Role, number> = { STUDENT: 0, MODERATOR: 1, ADMIN: 2 };

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** True when `role` is a valid role at or above `minimum`. */
export function hasMinimumRole(role: unknown, minimum: Role): boolean {
  return isRole(role) && RANK[role] >= RANK[minimum];
}

export type AccessDecision =
  | { allowed: true; role: Role }
  | { allowed: false; status: 401 | 403; reason: string };

/**
 * Decide access from the role claim of a session.
 * - no role (no/invalid session) -> 401
 * - unknown role or too low a role -> 403
 */
export function authorize(role: unknown, minimum: Role): AccessDecision {
  if (role === undefined || role === null || role === "") {
    return { allowed: false, status: 401, reason: "Authentication required" };
  }
  if (!isRole(role)) {
    return { allowed: false, status: 403, reason: "Unrecognised role" };
  }
  if (!hasMinimumRole(role, minimum)) {
    return { allowed: false, status: 403, reason: "Insufficient permissions" };
  }
  return { allowed: true, role };
}
