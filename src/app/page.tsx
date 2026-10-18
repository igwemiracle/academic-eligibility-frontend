"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";

export default function RootPage() {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  React.useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === "STUDENT") router.replace("/student");
        else if (user.role === "ADVISER") router.replace("/adviser");
        else if (user.role === "ADMIN") router.replace("/admin");
        else router.replace("/login");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, error, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
