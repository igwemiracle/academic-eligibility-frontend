"use client";

import * as React from "react";
import {
  HelpCircle,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  Calendar,
  Award,
} from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HelpPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="rounded-2xl border border-jostum-primary/20 bg-gradient-to-r from-jostum-deep via-jostum-primary to-jostum-bright p-6 sm:p-8 text-white shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <HelpCircle className="h-3.5 w-3.5 text-jostum-gold" />
            <span>User Documentation & Academic Guide</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            System Help & Academic Glossary
          </h1>
          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            Clear, step-by-step guidance on how to navigate the Academic Eligibility Tracking System, monitor graduation criteria, and understand university computation rules.
          </p>
        </div>
      </div>

      {/* What does my status mean? */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-jostum-primary" />
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            What Does My Status Mean?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Eligible */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider">
                Eligible for Graduation
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
              You have satisfied all academic computation benchmarks: you have achieved the minimum required earned units (166 for UTME or 121 for Direct Entry), your CGPA is at or above 1.00, and you have no missing or outstanding compulsory core courses.
            </p>
          </div>

          {/* Not Yet Eligible */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-5 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider">
                Not Yet Eligible
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              You still have one or more outstanding academic conditions: either you have not accumulated sufficient credit units, your CGPA is currently below 1.00, or you have unpassed compulsory courses / active carryovers to retake.
            </p>
          </div>
        </div>

        {/* Official Clearance Note */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-xs sm:text-sm text-muted-foreground shadow-xs">
          <Info className="h-5 w-5 shrink-0 text-jostum-primary mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-foreground">Official Clearance Notice:</strong> The eligibility status shown in this portal is calculated based on results entered to date. Formal graduation clearance and issuance of final statements of results are granted exclusively by the <strong>Department Examination Officer</strong> and the <strong>University Senate</strong>.
          </p>
        </div>
      </section>

      {/* Role-Specific User Guides */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-jostum-primary" />
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Step-by-Step Role Guides
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Guide */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-jostum-primary" />
                  Student Guide
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">4 Steps</Badge>
              </div>
              <CardDescription className="text-xs">
                How to audit your degree status and records
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Log In & Verify Profile</h4>
                  <p className="text-[11px] text-muted-foreground">Check your Matric Number, study level, and entry mode on your profile banner.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Read Your Status Card</h4>
                  <p className="text-[11px] text-muted-foreground">View your real-time graduation status, earned units progress bar, and CGPA classification.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">3</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Check Outstanding & Carryovers</h4>
                  <p className="text-[11px] text-muted-foreground">Inspect tables for required core courses not yet taken or failed courses requiring re-registration.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">4</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Review & Print Results</h4>
                  <p className="text-[11px] text-muted-foreground">Open the Results tab to inspect semester GPA, cumulative CGPA, and export printable transcripts.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adviser Guide */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-jostum-primary" />
                  Adviser Guide
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">3 Steps</Badge>
              </div>
              <CardDescription className="text-xs">
                How to monitor and counsel assigned students
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Open Your Student Roster</h4>
                  <p className="text-[11px] text-muted-foreground">Navigate to the Adviser Dashboard to access all undergraduate students assigned to your care.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Search and Filter</h4>
                  <p className="text-[11px] text-muted-foreground">Filter by level, graduation status, or search by student name/matric number to find at-risk cases.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">3</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Open Student Progress</h4>
                  <p className="text-[11px] text-muted-foreground">Click any student to view their completed units breakdown, carryovers, and printable academic transcript.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Guide */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-jostum-primary" />
                  Admin / Officer Guide
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">5 Steps</Badge>
              </div>
              <CardDescription className="text-xs">
                How to administer eligibility operations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Manage Users</h4>
                  <p className="text-[11px] text-muted-foreground">Add students, lecturers, advisers, and officers; assign roles and reset passwords.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Manage Courses & Sessions</h4>
                  <p className="text-[11px] text-muted-foreground">Maintain the departmental course catalog, credit units, semesters, and active academic sessions.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">3</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Enter or Import Results</h4>
                  <p className="text-[11px] text-muted-foreground">Upload CSV score sheets or enter individual course scores with instant grade and point computation.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">4</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Edit Graduation Rules</h4>
                  <p className="text-[11px] text-muted-foreground">Configure curriculum graduation benchmarks, minimum unit requirements, and compulsory lists.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">5</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Check Audit Logs</h4>
                  <p className="text-[11px] text-muted-foreground">Review timestamps, IP addresses, and exact records for every administrative update made in the system.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Academic Terms Glossary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-jostum-primary" />
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Academic Terms & Computation Glossary
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>CGPA</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Cumulative</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>Cumulative Grade Point Average:</strong> The overall weighted average of grade points earned across all semesters, computed as <code>Total Points Earned (TPE) / Total Credit Units Carried (TCC)</code> on a 5.00 grading scale.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>GPA</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Semester</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>Grade Point Average:</strong> The performance index for a single academic semester, calculated as <code>Current Points Earned (CPE) / Current Credit Units Carried (CCC)</code>.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>TCC vs TCE</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Units</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>TCC (Total Credit Units Carried):</strong> Total credit units registered across all semesters.<br />
              <strong>TCE (Total Credit Units Earned):</strong> Total credit units passed (grade A through E). Failed courses (F) are included in TCC but not in TCE.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>TPE</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Points</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>Total Points Earned:</strong> The sum of all quality points accrued across all courses. Quality points for each course equal <code>Units × Grade Point (A=5, B=4, C=3, D=2, E=1, F=0)</code>.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>CCC, CCE & CPE</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Semester Units</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Semester-level metrics: <strong>CCC</strong> is Current Credit Units Carried, <strong>CCE</strong> is Current Credit Units Earned (passed), and <strong>CPE</strong> is Current Points Earned for that specific semester.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>Core vs Elective Courses</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Curriculum</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>Core Courses:</strong> Compulsory foundational and departmental courses that <em>must</em> be passed to graduate. If failed, they must be carried over.<br />
              <strong>Elective Courses:</strong> Optional specialized courses selected to fulfill minimum total earned units.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>Carryover Course</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Academic Standing</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Any course where a student scored below 40% (grade F). Carryover courses remain active until re-registered and passed in a subsequent session. A student cannot graduate with unpassed compulsory carryovers.
            </CardContent>
          </Card>

          <Card className="border shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-jostum-primary flex items-center justify-between">
                <span>Entry Mode (UTME vs Direct Entry)</span>
                <Badge variant="secondary" className="font-mono text-[10px]">Admission</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              <strong>UTME:</strong> 4-year degree programme (100–400 Level). Graduation requires earning at least <strong>166 credit units</strong>.<br />
              <strong>Direct Entry (DE):</strong> 3-year degree programme (200–400 Level). Graduation requires earning at least <strong>121 credit units</strong>.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
