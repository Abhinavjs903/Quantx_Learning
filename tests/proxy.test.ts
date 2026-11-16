import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import { proxy } from "../src/proxy.ts";

process.env.NEXTAUTH_SECRET = "test-secret-not-real";

async function call(path: string, role?: string, cookie?: string) {
  const headers = new Headers();
  const value = cookie ?? (role ? await encode({ token: { role }, secret: process.env.NEXTAUTH_SECRET! }) : undefined);
  if (value) headers.set("cookie", `next-auth.session-token=${value}`);
  return proxy(new NextRequest(`http://localhost${path}`, { headers }));
}

test("anonymous /admin redirects to login with callbackUrl", async () => {
  const res = await call("/admin/users");
  assert.equal(res.status, 307);
  const loc = new URL(res.headers.get("location")!);
  assert.equal(loc.pathname, "/login");
  assert.equal(loc.searchParams.get("callbackUrl"), "/admin/users");
});

test("invalid session cookie is treated as anonymous", async () => {
  const res = await call("/admin", undefined, "garbage");
  assert.equal(res.status, 307);
});

test("STUDENT is blocked with 403", async () => {
  assert.equal((await call("/admin", "STUDENT")).status, 403);
});

test("MODERATOR and ADMIN pass through", async () => {
  for (const role of ["MODERATOR", "ADMIN"]) {
    const res = await call("/admin/resources", role);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("x-middleware-next"), "1");
  }
});
