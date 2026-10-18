"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { AppShell } from "@/components/layout/app-shell";

export default function AdviserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADVISER"]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
