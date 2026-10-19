"use client";

import * as React from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { AppShell } from "@/components/layout/app-shell";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STUDENT", "ADVISER", "ADMIN"]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
