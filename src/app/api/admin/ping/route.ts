import { requireRole } from "@/lib/auth/guards";

// Example of a guarded handler: ADMIN and MODERATOR (hierarchy) may call it.
export async function GET(req: Request) {
  const guard = await requireRole(req, "MODERATOR");
  if (!guard.ok) return guard.response;
  return Response.json({ ok: true, role: guard.role });
}
