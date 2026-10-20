"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Award,
  BookOpen,
  Calendar,
  AlertOctagon,
  ArrowRight,
  Printer,
  FileText,
  HelpCircle,
  Clock,
  User,
} from "@/components/icons";
import { ProgressSummary } from "@/lib/types";
import { formatCgpa } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Print-Only Institutional Header */}
      <div className="print-only print-header text-center pb-4 mb-4 border-b">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/jostum-logo.png"
          alt="JOSTUM Logo"
          className="h-20 w-auto mx-auto mb-2 object-contain"
        />
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          Joseph Sarwuan Tarka University, Makurdi
        </h1>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Department of Computer Science
        </h2>
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600 mt-1">
          Academic Eligibility & Graduation Audit Report (Unofficial)
        </h3>
        <div className="mt-3 grid grid-cols-2 text-left text-xs border-t pt-2 gap-y-1">
          <div><strong>Student Name:</strong> {summary.student.fullName}</div>
          <div><strong>Matric Number:</strong> {summary.student.matricNumber}</div>
          <div><strong>Department:</strong> {summary.student.department}</div>
          <div><strong>Current Level:</strong> {summary.student.level} Level</div>
          <div><strong>Entry Mode:</strong> {summary.student.entryMode === "DIRECT_ENTRY" ? "Direct Entry (DE)" : "UTME (100L)"}</div>
          <div><strong>Audit Date:</strong> {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
      </div>

      {/* JOSTUM Student Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-jostum-deep via-jostum-primary to-jostum-bright p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs text-jostum-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/jostum-logo.png" alt="JOSTUM" className="h-4 w-4 object-contain brightness-110" />
                <span>Computer Science Eligibility Tracker</span>
              </span>
              <Badge variant="outline" className="border-white/30 text-white font-mono text-xs">
                {summary.student.matricNumber}
              </Badge>
              {isAdviserView && (
                <Badge className="bg-jostum-gold text-slate-950 font-bold text-xs">
                  Adviser Audit View
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isAdviserView ? summary.student.fullName : `Welcome back, ${summary.student.fullName}`}
            </h1>

            <p className="text-xs text-white/80 sm:text-sm">
              {summary.student.department} • Level {summary.student.level} • Entry Year {summary.student.entryYear} •{" "}
              {summary.student.entryMode === "DIRECT_ENTRY" ? "Direct Entry (DE, 200L)" : "UTME (100L)"}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2 no-print">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" /> Print Audit
            </Button>
            {!isAdviserView && (
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="bg-white text-jostum-deep hover:bg-white/90 font-semibold text-xs gap-1.5 shadow-xs"
              >
                <Link href="/student/results">
                  View Results <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Main Content Layout with Learnthru Right-Hand Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: KPI Cards, Status, and Detailed Tables */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Eduvi 4-Stat KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* KPI 1: Earned Units */}
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Earned Credits
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary dark:bg-jostum-primary/20">
                    <BookOpen className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {summary.totalUnitsEarned}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    / {summary.totalUnitsRequired} units
                  </span>
                </div>
                <Progress
                  value={unitsPct}
                  className="h-2"
                  indicatorClassName={unitsCheck?.passed ? "bg-jostum-bright" : "bg-jostum-orange"}
                  aria-label="Credit units completion percentage"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{unitsPct}% Completed</span>
                  <span className="font-semibold text-foreground">
                    {summary.totalUnitsRequired - summary.totalUnitsEarned > 0
                      ? `${summary.totalUnitsRequired - summary.totalUnitsEarned} left`
                      : "Threshold met"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Cumulative CGPA */}
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cumulative CGPA
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary dark:bg-jostum-primary/20">
                    <Award className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {formatCgpa(summary.cgpa)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">/ 5.00</span>
                </div>
                <div>
                  <Badge
                    variant={cgpaCheck?.passed ? "secondary" : "destructive"}
                    className="text-[10px] font-semibold truncate max-w-full"
                  >
                    {summary.classOfDegree || "Pass Class"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  CCC: {summary.totalUnitsCarried} • CPE: {summary.totalPointsEarned.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            {/* KPI 3: Outstanding Compulsory Courses */}
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Required Core
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary dark:bg-jostum-primary/20">
                    <BookOpen className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {summary.outstandingCompulsory.length}
                  </span>
                  <span className="text-xs text-muted-foreground">Courses</span>
                </div>
                <div>
                  {summary.outstandingCompulsory.length === 0 ? (
                    <Badge variant="success" className="text-[10px] font-semibold gap-1">
                      <CheckCircle2 className="h-3 w-3" /> All Cleared
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px] font-semibold gap-1">
                      <AlertTriangle className="h-3 w-3" /> Action Required
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Compulsory core curriculum
                </p>
              </CardContent>
            </Card>

            {/* KPI 4: Carryovers */}
            <Card className="border border-border/80 bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Carryovers
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary dark:bg-jostum-primary/20">
                    <Clock className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {summary.carryovers.length}
                  </span>
                  <span className="text-xs text-muted-foreground">Unpassed</span>
                </div>
                <div>
                  {summary.carryovers.length === 0 ? (
                    <Badge variant="success" className="text-[10px] font-semibold gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Clean Record
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] font-semibold gap-1">
                      <AlertOctagon className="h-3 w-3" /> Must Retake
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Failed courses to register & clear
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prominent Graduation Eligibility Status Card */}
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              isEligible
                ? "border-[#0A8760]/30 bg-[#E4F5EE] text-[#0A8760] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-[#B45309]/30 bg-[#FEF3C7] text-[#B45309] dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                    isEligible
                      ? "bg-[#0A8760] text-white"
                      : "bg-[#B45309] text-white"
                  }`}
                >
                  {isEligible ? (
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Graduation Status
                    </span>
                    <Badge
                      className={`font-bold text-xs uppercase tracking-wider ${
                        isEligible
                          ? "bg-[#0A8760] text-white hover:bg-[#0A8760]/90"
                          : "bg-[#B45309] text-white hover:bg-[#B45309]/90"
                      }`}
                    >
                      {isEligible ? "ELIGIBLE FOR GRADUATION" : "NOT YET ELIGIBLE FOR GRADUATION"}
                    </Badge>
                  </div>

                  <h2 className="text-lg font-bold sm:text-xl text-slate-900 dark:text-white">
                    {isEligible
                      ? "Academic Graduation Criteria Satisfied"
                      : "Additional Requirements Remaining for Clearance"}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed">
                    {isEligible
                      ? `All computational criteria have been met: ${summary.totalUnitsEarned} earned credit units, minimum CGPA satisfied, and 0 missing compulsory courses.`
                      : `Currently ${summary.totalUnitsEarned} of ${summary.totalUnitsRequired} required credit units earned. Review the specific requirement checks below for details.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Clearance Disclaimer */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3.5 text-xs text-slate-700 dark:text-slate-300">
              <Info className="h-4 w-4 shrink-0 text-jostum-primary mt-0.5" />
              <p className="leading-relaxed">
                <strong>Notice:</strong> Official clearance is subject to final verification and approval by the Department Examination Officer and Senate.
              </p>
            </div>
          </div>

          {/* Outstanding Compulsory Courses & Carryovers Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outstanding Compulsory Courses Table */}
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold sm:text-base">
                      Outstanding Compulsory Courses
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Mandatory core courses required to graduate
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {summary.outstandingCompulsory.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {summary.outstandingCompulsory.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 text-[#0A8760] mx-auto mb-2" />
                    <p className="font-semibold text-foreground text-sm">All Compulsory Courses Cleared</p>
                    <p className="mt-1">You have passed all mandatory curriculum course requirements.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="w-[80px]">Code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead className="w-[50px] text-center">Units</TableHead>
                        <TableHead className="w-[100px] text-right">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.outstandingCompulsory.map((course) => (
                        <TableRow key={course.code}>
                          <TableCell className="font-mono font-semibold text-xs text-jostum-primary">
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
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold sm:text-base">
                      Unpassed Carryover Courses
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Failed courses (F) pending successful re-sit
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {summary.carryovers.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {summary.carryovers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 text-[#0A8760] mx-auto mb-2" />
                    <p className="font-semibold text-foreground text-sm">No Active Carryovers</p>
                    <p className="mt-1">You have zero active carryover courses on your record.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="w-[80px]">Code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead className="w-[50px] text-center">Units</TableHead>
                        <TableHead className="w-[80px] text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.carryovers.map((carryover) => (
                        <TableRow key={carryover.code}>
                          <TableCell className="font-mono font-semibold text-xs text-destructive">
                            {carryover.code}
                          </TableCell>
                          <TableCell className="text-xs">{carryover.title}</TableCell>
                          <TableCell className="text-center text-xs font-mono">
                            {carryover.units}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-destructive font-bold">
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

          {/* Study Progression Across Academic Levels Chart */}
          <AcademicChart data={summary.byLevel} />
        </div>

        {/* Right Column: Learnthru Quick Actions & Institutional Card */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 no-print">
          {/* Learnthru Quick Actions Card */}
          <Card className="border border-jostum-primary/20 bg-card shadow-xs overflow-hidden">
            <CardHeader className="bg-jostum-soft/50 dark:bg-jostum-primary/10 pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-xs">
                Tools and shortcuts for your academic audit
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {!isAdviserView && (
                <Button variant="outline" className="w-full justify-between text-xs h-9" asChild>
                  <Link href="/student/results">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-jostum-primary" />
                      View Semester Results
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handlePrint}
                className="w-full justify-between text-xs h-9"
              >
                <span className="flex items-center gap-2">
                  <Printer className="h-3.5 w-3.5 text-jostum-primary" />
                  Print / Save Audit PDF
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Button>

              <Button variant="outline" className="w-full justify-between text-xs h-9" asChild>
                <Link href="/help">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-3.5 w-3.5 text-jostum-primary" />
                    Help & Academic Terms
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Academic Profile Snapshot */}
          <Card className="border border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-jostum-primary" />
                Academic Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {summary.student.department}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Matric No:</span>
                <span className="font-mono font-semibold text-foreground">
                  {summary.student.matricNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Level:</span>
                <span className="font-semibold text-foreground">
                  {summary.student.level} Level
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entry Mode:</span>
                <Badge variant="outline" className="text-[10px]">
                  {summary.student.entryMode === "DIRECT_ENTRY" ? "Direct Entry (DE)" : "UTME (100L)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entry Year:</span>
                <span className="font-mono text-foreground">{summary.student.entryYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Required Units:</span>
                <span className="font-mono font-semibold text-jostum-primary">
                  {summary.totalUnitsRequired} Units
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Examination Office Advisory Card */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Info className="h-4 w-4 text-jostum-primary" />
              <span>Department Examination Office</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              For discrepancies regarding scores, unrecorded semester results, or course code changes, contact your academic adviser or visit the departmental examination office.
            </p>
          </div>
        </div>
      </div>

      {/* Print-Only Official Footer */}
      <div className="print-only print-footer">
        <p className="leading-relaxed">
          This is an unofficial student record generated by the Academic Eligibility Tracking System for advising purposes only. Official clearance is granted solely by the University Senate and Department Examination Officer.
        </p>
        <p className="text-[7pt] mt-1 text-slate-500">
          Generated automatically via JOSTUM Computer Science Eligibility Monitoring System • Page 1
        </p>
      </div>
    </div>
  );
}
