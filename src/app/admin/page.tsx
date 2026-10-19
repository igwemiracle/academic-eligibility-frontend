"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  AlertOctagon,
  BookOpen,
  Calendar,
  Sliders,
  History,
  ArrowRight,
  TrendingUp,
} from "@/components/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAdminStats } from "@/hooks/use-admin";
import { formatCgpa } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/state-indicators";

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error, refetch } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <ErrorState
        title="Could not load department statistics"
        message={
          (error as any)?.message ||
          "An error occurred while fetching department performance statistics."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const eligibleCount = stats.byStatus.ELIGIBLE;
  const notEligibleCount = stats.byStatus.NOT_YET_ELIGIBLE;
  const eligiblePct = stats.totalStudents > 0
    ? Math.round((eligibleCount / stats.totalStudents) * 100)
    : 0;

  const pieData = [
    { name: "Eligible for Graduation", value: eligibleCount, color: "#10b981" },
    { name: "Not Yet Eligible", value: notEligibleCount, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Department Eligibility Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time graduation eligibility monitoring for the Department of Computer Science.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit text-xs px-3 py-1">
          Active Academic Session: 2023/2024
        </Badge>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stats.totalStudents}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Enrolled undergraduates</p>
          </CardContent>
        </Card>

        {/* Eligible Students */}
        <Card className="border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Eligible
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
              {eligibleCount}
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              {eligiblePct}% clearance rate
            </p>
          </CardContent>
        </Card>

        {/* Not Yet Eligible */}
        <Card className="border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Not Yet Eligible
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
              {notEligibleCount}
            </div>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
              {100 - eligiblePct}% requirements pending
            </p>
          </CardContent>
        </Card>

        {/* Average CGPA */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average CGPA
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{formatCgpa(stats.averageCgpa)}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Scale of 5.00 points</p>
          </CardContent>
        </Card>

        {/* Students with Carryovers */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              With Carryovers
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-destructive">
              {stats.studentsWithCarryovers}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Active failed courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Distribution Pie */}
        <Card className="border shadow-xs lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Eligibility Distribution</CardTitle>
            <CardDescription className="text-xs">
              Proportion of students currently eligible for graduation clearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="rounded-lg border bg-popover p-2.5 shadow-md text-xs">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-muted-foreground mt-0.5">
                              {item.value} students (
                              {stats.totalStudents > 0
                                ? Math.round((Number(item.value) / stats.totalStudents) * 100)
                                : 0}
                              %)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Management Quick Actions */}
        <Card className="border shadow-xs lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Examination Administration Shortcuts
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access to administrative functions and catalog management
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/users"
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary flex items-center gap-1">
                  User Directory
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-xs text-muted-foreground">
                  Create students & advisers, assign mentors, and reset passwords.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/courses"
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary flex items-center gap-1">
                  Curriculum Courses
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-xs text-muted-foreground">
                  Manage course codes, credit units, levels, semesters, and core flags.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/results"
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary flex items-center gap-1">
                  Results & CSV Import
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-xs text-muted-foreground">
                  Record individual course marks or batch-import results via CSV template.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/requirements"
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sliders className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary flex items-center gap-1">
                  Graduation Rules
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-xs text-muted-foreground">
                  Configure minimum credit units for UTME/DE, pass mark, and degree bands.
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
