import { NextResponse, type NextRequest } from "next/server.js";
import { getToken } from "next-auth/jwt";
import { authorize } from "./lib/auth/rbac.ts";

// Blocks /admin/* for anyone who is not MODERATOR or above (ADMIN inherits).
// This is a first line of defence; API handlers must still call requireRole().
export async function proxy(request: NextRequest) {
  let role: unknown;
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    role = token?.role;
  } catch {
    role = null;
  }

  const decision = authorize(role, "MODERATOR");
  if (decision.allowed) return NextResponse.next();

  if (decision.status === 401) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
