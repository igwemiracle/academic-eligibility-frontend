"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, ArrowRight } from "@/components/icons";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();

  React.useEffect(() => {
    if (!isLoading && !user && error) {
      router.push("/login");
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background p-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    const roleHome =
      user.role === "STUDENT"
        ? "/student"
        : user.role === "ADVISER"
        ? "/adviser"
        : "/admin";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Access Restricted (403)
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your account is registered with the role{" "}
          <strong className="text-foreground">{user.role}</strong>. You do not
          have authorization to access this section of the system.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => router.push(roleHome)} className="gap-2">
            Go to {user.role.toLowerCase()} dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
