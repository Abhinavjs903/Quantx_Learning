import type { Role } from "@/lib/auth/rbac";

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
