"use client";

import * as React from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Layers,
  Printer,
} from "@/components/icons";
import { StudentResultsResponse, ProgressSummary } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/state-indicators";
import { formatCgpa } from "@/lib/utils";

function getGradeBadgeVariant(grade: string) {
  switch (grade) {
    case "A":
      return "success";
    case "B":
      return "secondary";
    case "C":
      return "outline";
    case "D":
    case "E":
      return "warning";
    case "F":
      return "destructive";
    default:
      return "outline";
  }
}

interface ResultsViewProps {
  resultsData: StudentResultsResponse;
  student?: ProgressSummary["student"];
  subtitle?: string;
}

export function ResultsView({ resultsData, student, subtitle }: ResultsViewProps) {
  const { sessions } = resultsData;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        title="No Academic Results Recorded"
        description="There are currently no session examination results recorded on this academic profile."
        icon={FileText}
      />
    );
  }

  // Calculate overall cumulative metrics across all sessions and semesters
  let cumulativeCCC = 0;
  let cumulativeCCE = 0;
  let cumulativeCPE = 0;

  sessions.forEach((s) => {
    s.semesters.forEach((sem) => {
      cumulativeCCC += sem.tcc;
      cumulativeCCE += sem.tce;
      cumulativeCPE += sem.tpe;
    });
  });

  const cumulativeCGPA = cumulativeCCC > 0 ? cumulativeCPE / cumulativeCCC : 0;

  return (
    <div className="space-y-8">
      {/* Print-Only Official Header */}
      <div className="print-only print-header">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          Joseph Sarwuan Tarka University, Makurdi
        </h1>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Department of Computer Science
        </h2>
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600 mt-1">
          Official Student Semester Examination Results Breakdown (Unofficial Copy)
        </h3>
        {student && (
          <div className="mt-3 grid grid-cols-2 text-left text-xs border-t pt-2 gap-y-1">
            <div><strong>Student Name:</strong> {student.fullName}</div>
            <div><strong>Matric Number:</strong> {student.matricNumber}</div>
            <div><strong>Department:</strong> {student.department}</div>
            <div><strong>Current Level:</strong> {student.level} Level</div>
            <div><strong>Entry Mode:</strong> {student.entryMode === "DIRECT_ENTRY" ? "Direct Entry (DE)" : "UTME (100L)"}</div>
            <div><strong>Date Generated:</strong> {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        )}
      </div>

      {/* Screen Toolbar: Print Button & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b pb-4">
        <div>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Official course examination marks arranged chronologically by academic session and semester.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 shadow-xs bg-card hover:bg-muted"
          >
            <Printer className="h-3.5 w-3.5 text-jostum-primary" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Sessions and Semesters */}
      <div className="space-y-8">
        {sessions.map((sessionItem, sessionIndex) => (
          <div key={sessionItem.session.id || sessionIndex} className="space-y-6 print-card">
            {/* Session Header */}
            <div className="flex items-center gap-3 border-b pb-2">
              <Calendar className="h-5 w-5 text-jostum-primary" />
              <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Session: {sessionItem.session.name}
              </h3>
            </div>

            {/* Semesters in Session */}
            <div className="space-y-6">
              {sessionItem.semesters.map((semesterItem) => (
                <Card
                  key={semesterItem.semester}
                  className="border shadow-xs overflow-hidden print-card"
                >
                  <CardHeader className="bg-muted/30 py-3.5 px-4 sm:px-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-jostum-primary" />
                        <CardTitle className="text-sm font-semibold sm:text-base">
                          {semesterItem.semester === 1
                            ? "First Semester Examination Results"
                            : "Second Semester Examination Results"}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs w-fit">
                        {semesterItem.results.length} course(s) registered
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/10">
                            <TableHead className="w-[100px]">Course Code</TableHead>
                            <TableHead>Course Title</TableHead>
                            <TableHead className="w-[60px] text-center">Units</TableHead>
                            <TableHead className="w-[90px] text-center">Score</TableHead>
                            <TableHead className="w-[80px] text-center">Grade</TableHead>
                            <TableHead className="w-[90px] text-center">Grade Point</TableHead>
                            <TableHead className="w-[110px] text-center">Points (Units × GP)</TableHead>
                            <TableHead className="w-[100px] text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semesterItem.results.map((result) => {
                            const weightedPoints = result.course.units * result.gradePoint;
                            return (
                              <TableRow key={result.id}>
                                <TableCell className="font-mono font-medium text-xs">
                                  {result.course.code}
                                  {result.course.isCompulsory && (
                                    <span className="ml-1 text-[10px] text-jostum-primary font-sans font-bold" title="Compulsory Course">
                                      *
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {result.course.title}
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs">
                                  {result.course.units}
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs font-medium">
                                  {result.score}%
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant={getGradeBadgeVariant(result.grade) as any}
                                    className="font-mono text-xs font-bold"
                                  >
                                    {result.grade}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs">
                                  {result.gradePoint}
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs font-semibold">
                                  {weightedPoints}
                                </TableCell>
                                <TableCell className="text-right">
                                  {result.passed ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Pass
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                                      <XCircle className="h-3.5 w-3.5" />
                                      Fail
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Semester Handbook Computation Strip */}
                    <div className="border-t bg-muted/40 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs text-muted-foreground">
                          * Compulsory curriculum course • Repeated courses are reflected in each registered session
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">TCC:</span>
                            <span className="font-mono font-bold text-foreground">
                              {semesterItem.tcc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">TCE:</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {semesterItem.tce}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">TPE:</span>
                            <span className="font-mono font-bold text-foreground">
                              {semesterItem.tpe}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-md bg-jostum-primary/10 px-2.5 py-1 text-jostum-primary dark:bg-jostum-primary/20">
                            <span className="font-medium">Semester GPA:</span>
                            <span className="font-mono font-bold">
                              {formatCgpa(semesterItem.gpa)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cumulative Computation Box */}
      <Card className="border-2 border-jostum-primary/30 bg-jostum-soft/30 dark:bg-jostum-primary/10 shadow-sm print-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-jostum-primary" />
            <CardTitle className="text-base font-bold sm:text-lg">
              Cumulative Academic Record (Summary Computation)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="rounded-lg border bg-card p-3 shadow-2xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                CCC (Units Carried)
              </span>
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono mt-1 block">
                {cumulativeCCC}
              </span>
              <span className="text-[11px] text-muted-foreground">All attempted registrations</span>
            </div>

            <div className="rounded-lg border bg-card p-3 shadow-2xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                CCE (Units Earned)
              </span>
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                {cumulativeCCE}
              </span>
              <span className="text-[11px] text-muted-foreground">Passed course units</span>
            </div>

            <div className="rounded-lg border bg-card p-3 shadow-2xs">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                CPE (Points Earned)
              </span>
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono mt-1 block">
                {cumulativeCPE.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted-foreground">Total grade points</span>
            </div>

            <div className="rounded-lg border-2 border-jostum-primary bg-jostum-primary text-white p-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
                CGPA (CPE / CCC)
              </span>
              <span className="text-3xl font-extrabold tracking-tight font-mono mt-1 block">
                {formatCgpa(cumulativeCGPA)}
              </span>
              <span className="text-[11px] opacity-90">Overall Cumulative GPA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print-Only Official Footer */}
      <div className="print-only print-footer">
        <p className="leading-relaxed">
          This is an unofficial student record generated by the Academic Eligibility Tracking System for advising purposes only. Official clearance is granted solely by the University Senate and Department Examination Officer.
        </p>
        <p className="text-[7pt] mt-1 text-slate-500">
          Joseph Sarwuan Tarka University, Makurdi • Department of Computer Science Eligibility Portal
        </p>
      </div>
    </div>
  );
}
