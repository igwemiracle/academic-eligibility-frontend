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
  Shield,
  FileSpreadsheet,
} from "@/components/icons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminStats } from "@/hooks/use-admin";
import { formatCgpa } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/state-indicators";
import { GettingStartedCard } from "@/components/shared/getting-started-card";

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
    { name: "Eligible for Graduation", value: eligibleCount, color: "#0A8760" },
    { name: "Not Yet Eligible", value: notEligibleCount, color: "#EF960A" },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Getting Started Guide Card */}
      <div className="no-print">
        <GettingStartedCard role="admin" />
      </div>

      {/* JOSTUM Admin Banner */}
      <div className="rounded-2xl border border-jostum-primary/20 bg-gradient-to-r from-jostum-deep via-jostum-primary to-jostum-bright p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs text-jostum-gold">
              <Shield className="h-3.5 w-3.5" />
              <span>Examination Officer & Admin Console</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Department Eligibility Overview
            </h1>
            <p className="text-xs text-white/80 sm:text-sm max-w-2xl leading-relaxed">
              Real-time academic monitoring, clearance analytics, course catalogue management, and student score administration for the Department of Computer Science.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Badge variant="outline" className="border-white/30 text-white font-mono text-xs px-3 py-1 bg-white/10">
              Session: 2023/2024
            </Badge>
          </div>
        </div>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <Card className="border border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Enrolled
            </CardTitle>
            <Users className="h-4 w-4 text-jostum-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight font-mono text-foreground">
              {stats.totalStudents}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Undergraduate students</p>
          </CardContent>
        </Card>

        {/* Eligible Students */}
        <Card className="border border-[#0A8760]/30 bg-[#E4F5EE]/40 dark:bg-emerald-950/20 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#0A8760] dark:text-emerald-400">
              Eligible
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#0A8760] dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-[#0A8760] dark:text-emerald-300 font-mono">
              {eligibleCount}
            </div>
            <p className="text-[11px] text-[#0A8760]/80 dark:text-emerald-400/80 mt-1 font-semibold">
              {eligiblePct}% clearance rate
            </p>
          </CardContent>
        </Card>

        {/* Not Yet Eligible */}
        <Card className="border border-[#B45309]/30 bg-[#FEF3C7]/40 dark:bg-amber-950/20 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#B45309] dark:text-amber-400">
              Pending Clearance
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#B45309] dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-[#B45309] dark:text-amber-300 font-mono">
              {notEligibleCount}
            </div>
            <p className="text-[11px] text-[#B45309]/80 dark:text-amber-400/80 mt-1 font-semibold">
              {100 - eligiblePct}% requirements pending
            </p>
          </CardContent>
        </Card>

        {/* Average CGPA */}
        <Card className="border border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cohort CGPA
            </CardTitle>
            <Award className="h-4 w-4 text-jostum-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight font-mono text-foreground">
              {formatCgpa(stats.averageCgpa)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Scale of 5.00 points</p>
          </CardContent>
        </Card>

        {/* Students with Carryovers */}
        <Card className="border border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              With Carryovers
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-destructive font-mono">
              {stats.studentsWithCarryovers}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Active failed courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Chart & Administrative Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Distribution Pie */}
        <Card className="border border-border/80 shadow-xs lg:col-span-1">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-bold text-foreground">
              Eligibility Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Proportion of students currently eligible for graduation clearance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
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
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-muted-foreground mt-0.5 font-mono">
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

        {/* Management Quick Shortcuts (6 Cards) */}
        <Card className="border border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-bold text-foreground">
              Examination Administration Shortcuts
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access to administrative functions and catalog management
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/users"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <Users className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  User Directory
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Manage student and adviser accounts, assign cohorts, reset credentials.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/courses"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  Curriculum Courses
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Maintain course codes, credit units, levels, semesters, and core flags.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/sessions"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  Academic Sessions
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Create academic sessions, set active session, and toggle semesters.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/results"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  Results Entry & CSV Import
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Batch upload results via CSV score sheets or enter individual course scores.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/requirements"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <Sliders className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  Graduation Rules
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Configure minimum credit units for UTME/DE, pass mark, and degree bands.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="group flex items-start gap-3 rounded-xl border border-border/70 p-3.5 transition-all hover:border-jostum-primary hover:bg-jostum-soft/20 shadow-2xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jostum-primary/10 text-jostum-primary group-hover:bg-jostum-primary group-hover:text-white transition-colors">
                <History className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground group-hover:text-jostum-primary flex items-center gap-1">
                  System Audit Logs
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Audit grade changes, user creation, rule updates, and security logs.
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
