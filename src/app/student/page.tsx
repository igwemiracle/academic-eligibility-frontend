"use client";

import * as React from "react";
import { useStudentProgress } from "@/hooks/use-student";
import { ProgressSummaryView } from "@/components/shared/progress-summary";
import { GettingStartedCard } from "@/components/shared/getting-started-card";
import { DashboardSkeleton, ErrorState } from "@/components/shared/state-indicators";

export default function StudentDashboardPage() {
  const { data: progress, isLoading, error, refetch } = useStudentProgress();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !progress) {
    return (
      <ErrorState
        title="Could not load your eligibility status"
        message={
          (error as any)?.message ||
          "We were unable to retrieve your graduation progress details from the university server."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <GettingStartedCard role="student" />
      </div>
      <ProgressSummaryView summary={progress} isAdviserView={false} />
    </div>
  );
}
