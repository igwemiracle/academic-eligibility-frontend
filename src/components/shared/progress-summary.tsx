"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  AlertOctagon,
  ArrowUpRight,
} from "lucide-react";
import { ProgressSummary } from "@/lib/types";
import { formatCgpa, formatUnits } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AcademicChart } from "@/components/shared/academic-chart";

interface ProgressSummaryProps {
  summary: ProgressSummary;
  isAdviserView?: boolean;
}

export function ProgressSummaryView({
  summary,
  isAdviserView = false,
}: ProgressSummaryProps) {
  const isEligible = summary.status === "ELIGIBLE";
  const unitsPct = Math.min(
    100,
    Math.round((summary.totalUnitsEarned / (summary.totalUnitsRequired || 1)) * 100)
  );

  const unitsCheck = summary.checks.find((c) => c.key === "TOTAL_UNITS");
  const cgpaCheck = summary.checks.find((c) => c.key === "CGPA");
  const coursesCheck = summary.checks.find((c) => c.key === "COMPULSORY_COURSES");

  return (
    <div className="space-y-6">
      {/* Student Profile Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {summary.student.fullName}
            </h2>
            <Badge variant="outline" className="font-mono text-xs">
              {summary.student.matricNumber}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.student.department} • Level {summary.student.level} • Entry Year {summary.student.entryYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium py-1 px-3">
            Entry Mode: {summary.student.entryMode === "DIRECT_ENTRY" ? "Direct Entry (DE)" : "UTME"}
          </Badge>
          {isAdviserView && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Adviser Monitoring View
            </Badge>
          )}
        </div>
      </div>

      {/* Main Graduation Eligibility Status Card */}
      <div
        className={`rounded-xl border p-6 shadow-sm transition-colors ${
          isEligible
            ? "border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
            : "border-amber-300 bg-amber-50/70 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                isEligible
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "bg-amber-600 text-white dark:bg-amber-500"
              }`}
            >
              {isEligible ? (
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-7 w-7" aria-hidden="true" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Current Graduation Eligibility Status
                </span>
                <Badge
                  variant={isEligible ? "success" : "warning"}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  {isEligible ? "Eligible" : "Not Yet Eligible"}
                </Badge>
              </div>

              <h3 className="text-lg font-bold sm:text-xl">
                {isEligible
                  ? "Academic Graduation Criteria Satisfied"
                  : "Additional Requirements Remaining for Clearance"}
              </h3>

              <p className="text-sm opacity-90 max-w-3xl">
                {isEligible
                  ? `All academic checks for total earned credit units (${summary.totalUnitsEarned}/${summary.totalUnitsRequired}), minimum CGPA, and compulsory courses have been met.`
                  : `Currently ${summary.totalUnitsEarned} of ${summary.totalUnitsRequired} required credit units earned. Review the specific requirement checks below for details.`}
              </p>
            </div>
          </div>
        </div>

        {/* Official Clearance Note */}
        <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-xs">
          <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">
            <strong>Notice:</strong> This system monitors and calculates academic eligibility status. Official graduation clearance is formally administered by the Department Examination Officer.
          </p>
        </div>
      </div>

      {/* 3 Core Requirement Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Check 1: Total Units */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                1. Earned Credit Units
              </CardTitle>
              {unitsCheck?.passed ? (
                <Badge variant="success" className="gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Met
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1 text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Pending
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              CCE against required minimum ({summary.student.entryMode === "DIRECT_ENTRY" ? "121 DE" : "166 UTME"})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight">
                {summary.totalUnitsEarned}
              </span>
              <span className="text-xs text-muted-foreground">
                of {summary.totalUnitsRequired} units required
              </span>
            </div>

            <Progress
              value={unitsPct}
              className="h-2"
              indicatorClassName={unitsCheck?.passed ? "bg-emerald-600" : "bg-amber-500"}
              aria-label="Credit units completion progress"
            />

            <p className="text-xs text-muted-foreground leading-relaxed">
              {unitsCheck?.detail || `Earned ${summary.totalUnitsEarned} of ${summary.totalUnitsRequired} units.`}
            </p>
          </CardContent>
        </Card>

        {/* Check 2: CGPA & Degree Class Standing */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                2. Cumulative GPA (CGPA)
              </CardTitle>
              {cgpaCheck?.passed ? (
                <Badge variant="success" className="gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Met
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 text-[11px]">
                  <AlertOctagon className="h-3 w-3" /> Below 1.00
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Cumulative Points Earned (CPE) / Units Carried (CCC)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight">
                  {formatCgpa(summary.cgpa)}
                </span>
                <span className="text-xs text-muted-foreground">/ 5.00</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                CCC: {summary.totalUnitsCarried} | CPE: {summary.totalPointsEarned.toFixed(1)}
              </span>
            </div>

            {/* Current Degree Class Standing */}
            <div className="rounded-md border bg-muted/30 p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Current Standing (Indicative Only)
              </span>
              <span className="text-xs font-semibold text-foreground">
                {summary.classOfDegree || "Not Available"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {cgpaCheck?.detail || `Current CGPA is ${formatCgpa(summary.cgpa)} against minimum 1.00.`}
            </p>
          </CardContent>
        </Card>

        {/* Check 3: Compulsory Courses */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                3. Compulsory Courses
              </CardTitle>
              {coursesCheck?.passed ? (
                <Badge variant="success" className="gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> All Passed
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1 text-[11px]">
                  <AlertTriangle className="h-3 w-3" /> Outstanding
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Departmental core and compulsory requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight">
                {summary.outstandingCompulsory.length === 0
                  ? "Completed"
                  : `${summary.outstandingCompulsory.length} Remaining`}
              </span>
              <span className="text-xs text-muted-foreground">
                {summary.carryovers.length} active carryover(s)
              </span>
            </div>

            <div className="rounded-md border bg-muted/30 p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Compulsory Status
              </span>
              <span className="text-xs font-semibold text-foreground">
                {summary.outstandingCompulsory.length === 0
                  ? "No missing or failed compulsory courses"
                  : `${summary.outstandingCompulsory.length} compulsory course(s) require attention`}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {coursesCheck?.detail || "All compulsory curriculum courses must be passed."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Compulsory Courses & Carryovers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Compulsory Courses Table */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Outstanding Compulsory Courses
                </CardTitle>
                <CardDescription className="text-xs">
                  Required core courses not yet completed or failed
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                {summary.outstandingCompulsory.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {summary.outstandingCompulsory.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-foreground">No Outstanding Compulsory Courses</p>
                <p className="text-xs mt-1">You have satisfied all compulsory curriculum course requirements.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="w-[60px] text-center">Units</TableHead>
                    <TableHead className="w-[110px] text-right">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.outstandingCompulsory.map((course) => (
                    <TableRow key={course.code}>
                      <TableCell className="font-mono font-medium text-xs">
                        {course.code}
                      </TableCell>
                      <TableCell className="text-xs">{course.title}</TableCell>
                      <TableCell className="text-center text-xs font-mono">
                        {course.units}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={course.reason === "FAILED" ? "destructive" : "warning"}
                          className="text-[10px] font-semibold"
                        >
                          {course.reason === "FAILED" ? "Failed (Carryover)" : "Not Yet Taken"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Carryovers List */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Unpassed Carryover Courses
                </CardTitle>
                <CardDescription className="text-xs">
                  Failed courses that have not yet been cleared on a subsequent re-sit
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                {summary.carryovers.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {summary.carryovers.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-foreground">No Active Carryovers</p>
                <p className="text-xs mt-1">You currently have no unpassed courses on your academic record.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="w-[60px] text-center">Units</TableHead>
                    <TableHead className="w-[90px] text-right">Last Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.carryovers.map((carryover) => (
                    <TableRow key={carryover.code}>
                      <TableCell className="font-mono font-medium text-xs">
                        {carryover.code}
                      </TableCell>
                      <TableCell className="text-xs">{carryover.title}</TableCell>
                      <TableCell className="text-center text-xs font-mono">
                        {carryover.units}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-destructive font-semibold">
                        {carryover.lastScore}% (F)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progression Across Study Levels Chart */}
      <AcademicChart data={summary.byLevel} />
    </div>
  );
}
