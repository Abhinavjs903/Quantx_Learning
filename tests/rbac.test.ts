import { test } from "node:test";
import assert from "node:assert/strict";
import { authorize, hasMinimumRole, isRole } from "../src/lib/auth/rbac.ts";
import { requireRole } from "../src/lib/auth/guards.ts";

const req = new Request("http://localhost/api/admin/ping");

test("isRole accepts only known roles", () => {
  assert.equal(isRole("ADMIN"), true);
  assert.equal(isRole("admin"), false);
  assert.equal(isRole(undefined), false);
  assert.equal(isRole(1), false);
});

test("role hierarchy: ADMIN > MODERATOR > STUDENT", () => {
  assert.equal(hasMinimumRole("ADMIN", "MODERATOR"), true);
  assert.equal(hasMinimumRole("ADMIN", "ADMIN"), true);
  assert.equal(hasMinimumRole("MODERATOR", "ADMIN"), false);
  assert.equal(hasMinimumRole("STUDENT", "MODERATOR"), false);
  assert.equal(hasMinimumRole("STUDENT", "STUDENT"), true);
});

test("authorize: allowed role", () => {
  assert.deepEqual(authorize("MODERATOR", "MODERATOR"), { allowed: true, role: "MODERATOR" });
});

test("authorize: denied role is 403", () => {
  const d = authorize("STUDENT", "MODERATOR");
  assert.equal(d.allowed, false);
  assert.equal(d.allowed === false && d.status, 403);
});

test("authorize: missing role is 401, unknown role is 403", () => {
  for (const missing of [undefined, null, ""]) {
    const d = authorize(missing, "STUDENT");
    assert.equal(d.allowed === false && d.status, 401);
  }
  const d = authorize("SUPERUSER", "STUDENT");
  assert.equal(d.allowed === false && d.status, 403);
});

test("requireRole: allows ADMIN on a MODERATOR route", async () => {
  const r = await requireRole(req, "MODERATOR", async () => "ADMIN");
  assert.deepEqual(r.ok && r.role, "ADMIN");
});

test("requireRole: STUDENT gets 403 JSON", async () => {
  const r = await requireRole(req, "MODERATOR", async () => "STUDENT");
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.equal(r.response.status, 403);
    assert.deepEqual(await r.response.json(), { error: "Insufficient permissions" });
  }
});

test("requireRole: no token gives 401", async () => {
  const r = await requireRole(req, "STUDENT", async () => undefined);
  assert.equal(!r.ok && r.response.status, 401);
});

test("requireRole: resolver that throws (invalid token) gives 401", async () => {
  const r = await requireRole(req, "STUDENT", async () => {
    throw new Error("bad jwt");
  });
  assert.equal(!r.ok && r.response.status, 401);
});

test("requireRole default resolver: missing and garbage tokens give 401, valid token works", async () => {
  process.env.NEXTAUTH_SECRET = "test-secret-not-real";
  const none = await requireRole(req, "STUDENT");
  assert.equal(!none.ok && none.response.status, 401);

  const garbage = await requireRole(
    new Request("http://localhost/x", { headers: { authorization: "Bearer not.a.jwt" } }),
    "STUDENT",
  );
  assert.equal(!garbage.ok && garbage.response.status, 401);

  const { encode } = await import("next-auth/jwt");
  const good = await encode({ token: { role: "ADMIN" }, secret: process.env.NEXTAUTH_SECRET });
  const ok = await requireRole(
    new Request("http://localhost/x", { headers: { authorization: `Bearer ${good}` } }),
    "ADMIN",
  );
  assert.equal(ok.ok, true);

  const stud = await encode({ token: { role: "STUDENT" }, secret: process.env.NEXTAUTH_SECRET });
  const denied = await requireRole(
    new Request("http://localhost/x", { headers: { authorization: `Bearer ${stud}` } }),
    "ADMIN",
  );
  assert.equal(!denied.ok && denied.response.status, 403);
});
