"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
  BookOpen,
} from "@/components/icons";
import { useAdviserStudents } from "@/hooks/use-adviser";
import { formatCgpa } from "@/lib/utils";
import { StudentListItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState, EmptyState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";
import { GettingStartedCard } from "@/components/shared/getting-started-card";
import { SortableDataTable, DataColumn } from "@/components/arc/sortable-data-table/sortable-data-table";

export default function AdviserPage() {
  const [search, setSearch] = React.useState("");
  const [level, setLevel] = React.useState("ALL");
  const [status, setStatus] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useAdviserStudents({
    search: search.trim(),
    level: level === "ALL" ? "" : level,
    status: status === "ALL" ? "" : status,
    page,
    pageSize,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  // Compute summary stats from current cohort
  const eligibleCount = React.useMemo(() => {
    if (!data?.items) return 0;
    return data.items.filter((s) => s.status === "ELIGIBLE").length;
  }, [data?.items]);

  const notYetEligibleCount = React.useMemo(() => {
    if (!data?.items) return 0;
    return data.items.filter((s) => s.status === "NOT_YET_ELIGIBLE").length;
  }, [data?.items]);

  const columns: DataColumn<StudentListItem>[] = React.useMemo(
    () => [
      {
        key: "fullName",
        label: "Student Name",
        sortable: true,
        render: (_, row) => (
          <div className="py-1">
            <Link
              href={`/adviser/students/${row.studentId}`}
              className="font-semibold text-foreground hover:text-jostum-primary hover:underline text-sm block"
            >
              {row.fullName}
            </Link>
          </div>
        ),
      },
      {
        key: "matricNumber",
        label: "Matric Number",
        sortable: true,
        render: (_, row) => (
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {row.matricNumber}
          </span>
        ),
      },
      {
        key: "level",
        label: "Level",
        sortable: true,
        numeric: true,
        render: (_, row) => (
          <Badge variant="outline" className="font-mono text-xs">
            {row.level}L
          </Badge>
        ),
      },
      {
        key: "cgpa",
        label: "CGPA",
        sortable: true,
        numeric: true,
        render: (_, row) => (
          <span className="font-mono text-xs font-bold text-foreground">
            {formatCgpa(row.cgpa)}
          </span>
        ),
      },
      {
        key: "totalUnitsEarned",
        label: "Units Earned",
        sortable: true,
        numeric: true,
        render: (_, row) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            {row.totalUnitsEarned}
          </span>
        ),
      },
      {
        key: "status",
        label: "Graduation Status",
        sortable: true,
        render: (_, row) => {
          const isEligible = row.status === "ELIGIBLE";
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isEligible
                  ? "bg-[#E4F5EE] text-[#0A8760] dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-950/50 dark:text-amber-300"
              }`}
            >
              {isEligible ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Eligible
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Not Yet Eligible
                </>
              )}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Action",
        sortable: false,
        render: (_, row) => (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-1 text-xs text-jostum-primary hover:text-jostum-primary hover:bg-jostum-soft/40"
          >
            <Link href={`/adviser/students/${row.studentId}`}>
              Audit <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Adviser Getting Started Guide Card */}
      <div className="no-print">
        <GettingStartedCard role="adviser" />
      </div>

      {/* Page Title & KPI Banner */}
      <div className="rounded-2xl border border-jostum-primary/20 bg-gradient-to-r from-jostum-deep via-jostum-primary to-jostum-bright p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs text-jostum-gold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jostum-logo.png" alt="JOSTUM" className="h-4 w-4 object-contain brightness-110" />
              <span>Academic Advisory Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Assigned Students Roster
            </h1>
            <p className="text-xs text-white/80 sm:text-sm max-w-xl">
              Audit credit units completion, check outstanding courses, and verify graduation clearance status.
            </p>
          </div>

          {data && (
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                  Total Cohort
                </span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {data.total}
                </span>
              </div>
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-jostum-gold block">
                  Eligible (Page)
                </span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {eligibleCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or matric..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10 text-xs"
                aria-label="Search students by name or matric number"
              />
            </div>

            {/* Level Filter */}
            <div>
              <Select
                value={level}
                onValueChange={(val) => {
                  setLevel(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 text-xs" aria-label="Filter by level">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={status}
                onValueChange={(val) => {
                  setStatus(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 text-xs" aria-label="Filter by status">
                  <SelectValue placeholder="All Eligibility Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ELIGIBLE">Eligible Only</SelectItem>
                  <SelectItem value="NOT_YET_ELIGIBLE">Not Yet Eligible Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Sortable Table */}
      {isLoading ? (
        <Card className="border shadow-xs">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      ) : error ? (
        <ErrorState
          title="Could not load student roster"
          message={
            (error as any)?.message ||
            "An error occurred while fetching your assigned students."
          }
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No Students Found"
          description={
            search || level !== "ALL" || status !== "ALL"
              ? "No students match your selected filter criteria. Try adjusting your search query or filters."
              : "No students are currently assigned to your advisory profile."
          }
          icon={Users}
          action={
            search || level !== "ALL" || status !== "ALL"
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearch("");
                    setLevel("ALL");
                    setStatus("ALL");
                    setPage(1);
                  },
                }
              : undefined
          }
        />
      ) : (
        <Card className="border border-border/80 shadow-xs overflow-hidden">
          <div className="p-2 sm:p-4">
            <SortableDataTable<StudentListItem>
              rows={data.items}
              columns={columns}
              rowKey="studentId"
              caption="Assigned undergraduate students graduation eligibility roster"
              emptyMessage="No students match the criteria."
              defaultSort={{ key: "fullName", direction: "asc" }}
            />
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
              <span className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} ({data.total} total students)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
