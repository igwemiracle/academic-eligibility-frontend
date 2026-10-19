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
  GraduationCap,
} from "@/components/icons";
import { useAdviserStudents } from "@/hooks/use-adviser";
import { formatCgpa } from "@/lib/utils";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState, EmptyState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Assigned Students Roster
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor academic progress and graduation eligibility for students under your advisory.
          </p>
        </div>

        {data && (
          <Badge variant="outline" className="w-fit text-xs font-medium px-3 py-1">
            {data.total} Total Student{data.total === 1 ? "" : "s"} Assigned
          </Badge>
        )}
      </div>

      {/* Filters Card */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or matric number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10"
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
                <SelectTrigger className="h-10" aria-label="Filter by level">
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
                <SelectTrigger className="h-10" aria-label="Filter by status">
                  <SelectValue placeholder="All Eligibility Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ELIGIBLE">Eligible</SelectItem>
                  <SelectItem value="NOT_YET_ELIGIBLE">Not Yet Eligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
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
          title="Could not load student list"
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
        <Card className="border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-[140px]">Matric Number</TableHead>
                  <TableHead className="w-[80px] text-center">Level</TableHead>
                  <TableHead className="w-[100px] text-center">CGPA</TableHead>
                  <TableHead className="w-[110px] text-center">Units Earned</TableHead>
                  <TableHead className="w-[150px] text-center">Eligibility Status</TableHead>
                  <TableHead className="w-[110px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((student) => {
                  const isEligible = student.status === "ELIGIBLE";
                  return (
                    <TableRow key={student.studentId} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <Link
                          href={`/adviser/students/${student.studentId}`}
                          className="hover:underline text-primary"
                        >
                          {student.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {student.matricNumber}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {student.level}L
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-semibold">
                        {formatCgpa(student.cgpa)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {student.totalUnitsEarned}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={isEligible ? "success" : "warning"}
                          className="text-[11px] font-semibold gap-1"
                        >
                          {isEligible ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Eligible
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3" />
                              Not Yet Eligible
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 gap-1 text-xs"
                        >
                          <Link href={`/adviser/students/${student.studentId}`}>
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
