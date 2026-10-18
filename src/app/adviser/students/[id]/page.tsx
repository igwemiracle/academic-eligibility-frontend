"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LayoutDashboard, FileText, UserCheck } from "lucide-react";
import {
  useAdviserStudentProgress,
  useAdviserStudentResults,
} from "@/hooks/use-adviser";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressSummaryView } from "@/components/shared/progress-summary";
import { ResultsView } from "@/components/shared/results-view";
import { DashboardSkeleton, ErrorState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdviserStudentDetailPage() {
  const params = useParams();
  const studentId = typeof params.id === "string" ? params.id : "";

  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useAdviserStudentProgress(studentId);

  const {
    data: resultsData,
    isLoading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useAdviserStudentResults(studentId);

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href="/adviser">
            <ArrowLeft className="h-4 w-4" />
            Back to Roster
          </Link>
        </Button>
      </div>

      {/* Tabs: Graduation Eligibility vs Academic Results */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="progress" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Eligibility Progress
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <FileText className="h-4 w-4" />
            Academic Transcript
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Graduation Eligibility Progress */}
        <TabsContent value="progress" className="space-y-4">
          {progressLoading ? (
            <DashboardSkeleton />
          ) : progressError || !progress ? (
            <ErrorState
              title="Could not load student progress"
              message={
                (progressError as any)?.message ||
                "Failed to retrieve the academic graduation eligibility status for this student."
              }
              onRetry={() => refetchProgress()}
            />
          ) : (
            <ProgressSummaryView summary={progress} isAdviserView={true} />
          )}
        </TabsContent>

        {/* Tab 2: Academic Results Transcript */}
        <TabsContent value="results" className="space-y-4">
          {resultsLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : resultsError || !resultsData ? (
            <ErrorState
              title="Could not load student results"
              message={
                (resultsError as any)?.message ||
                "Failed to retrieve examination results for this student."
              }
              onRetry={() => refetchResults()}
            />
          ) : (
            <ResultsView
              resultsData={resultsData}
              subtitle="Full semester-by-semester breakdown and handbook computations for this student."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
