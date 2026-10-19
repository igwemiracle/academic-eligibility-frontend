"use client";

import * as React from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Layers,
} from "@/components/icons";
import { StudentResultsResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      return "info";
    case "C":
      return "secondary";
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
  subtitle?: string;
}

export function ResultsView({ resultsData, subtitle }: ResultsViewProps) {
  const { sessions } = resultsData;

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
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}

      {/* Sessions and Semesters */}
      <div className="space-y-8">
        {sessions.map((sessionItem, sessionIndex) => (
          <div key={sessionItem.session.id || sessionIndex} className="space-y-6">
            {/* Session Header */}
            <div className="flex items-center gap-3 border-b pb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Session: {sessionItem.session.name}
              </h3>
            </div>

            {/* Semesters in Session */}
            <div className="space-y-6">
              {sessionItem.semesters.map((semesterItem) => (
                <Card
                  key={semesterItem.semester}
                  className="border shadow-xs overflow-hidden"
                >
                  <CardHeader className="bg-muted/30 py-3.5 px-4 sm:px-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
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
                                    <span className="ml-1 text-[10px] text-primary font-sans font-bold">
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
                          <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-primary">
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

      {/* Cumulative Cumulative Computation Box (Handbook Sample Layout) */}
      <Card className="border-2 border-primary/30 bg-primary/5 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold sm:text-lg">
              Cumulative Academic Record (Handbook Summary Computation)
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

            <div className="rounded-lg border-2 border-primary bg-primary text-primary-foreground p-3 shadow-sm">
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
    </div>
  );
}
