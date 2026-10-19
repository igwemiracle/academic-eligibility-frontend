"use client";

import * as React from "react";
import { FileText } from "@/components/icons";
import { useStudentResults } from "@/hooks/use-student";
import { ErrorState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsView } from "@/components/shared/results-view";

export default function StudentResultsPage() {
  const { data: resultsData, isLoading, error, refetch } = useStudentResults();

  if (isLoading) {
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

  if (error || !resultsData) {
    return (
      <ErrorState
        title="Could not load academic transcript"
        message={
          (error as any)?.message ||
          "An error occurred while fetching your semester examination results."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Official Academic Results Breakdown
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Course results grouped by academic session and semester according to the university handbook computation scheme.
        </p>
      </div>

      <ResultsView resultsData={resultsData} />
    </div>
  );
}
