// Server-side role guard for API route handlers. Never rely on client checks.
//
// Usage:
//   export async function POST(req: Request) {
//     const guard = await requireRole(req, "ADMIN");
//     if (!guard.ok) return guard.response;
//     ...
//   }
import { authorize, type Role } from "./rbac.ts";

/** Reads the role claim from the NextAuth JWT (null when missing/invalid). */
export async function getSessionRole(req: Request): Promise<unknown> {
  const { getToken } = await import("next-auth/jwt");
  const token = await getToken({
    // getToken only reads headers/cookies, which the Fetch Request also has.
    req: req as unknown as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.role;
}

export type GuardResult =
  | { ok: true; role: Role }
  | { ok: false; response: Response };

export async function requireRole(
  req: Request,
  minimum: Role,
  resolveRole: (req: Request) => Promise<unknown> = getSessionRole,
): Promise<GuardResult> {
  let role: unknown;
  try {
    role = await resolveRole(req);
  } catch {
    // A token that cannot be verified is treated as no session.
    role = null;
  }
  const decision = authorize(role, minimum);
  if (decision.allowed) return { ok: true, role: decision.role };
  return {
    ok: false,
    response: Response.json(
      { error: decision.reason },
      { status: decision.status },
    ),
  };
}
