"use client";

import * as React from "react";
import { FileText, Printer } from "@/components/icons";
import { useStudentResults, useStudentProgress } from "@/hooks/use-student";
import { ErrorState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsView } from "@/components/shared/results-view";

export default function StudentResultsPage() {
  const { data: resultsData, isLoading: resultsLoading, error: resultsError, refetch: refetchResults } = useStudentResults();
  const { data: progress } = useStudentProgress();

  if (resultsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (resultsError || !resultsData) {
    return (
      <ErrorState
        title="Could not load academic transcript"
        message={
          (resultsError as any)?.message ||
          "An error occurred while fetching your semester examination results."
        }
        onRetry={() => refetchResults()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 no-print">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-jostum-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Official Academic Results Breakdown
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Course marks grouped chronologically by academic session and semester under the university 5.00 grading system.
        </p>
      </div>

      <ResultsView resultsData={resultsData} student={progress?.student} />
    </div>
  );
}
