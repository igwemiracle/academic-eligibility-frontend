"use client";

import * as React from "react";
import Link from "next/link";
import { X, HelpCircle, ArrowRight } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface GettingStartedCardProps {
  role: "student" | "adviser" | "admin";
  storageKey?: string;
}

const roleGuides: Record<
  "student" | "adviser" | "admin",
  {
    title: string;
    subtitle: string;
    steps: { num: number; title: string; desc: string }[];
  }
> = {
  student: {
    title: "Getting Started with Your Eligibility Tracker",
    subtitle: "Follow these 4 quick steps to monitor your progress toward graduation:",
    steps: [
      {
        num: 1,
        title: "Verify Your Bio",
        desc: "Ensure your Matric Number, Level, and Entry Mode (UTME/DE) are accurate.",
      },
      {
        num: 2,
        title: "Read Your Status Card",
        desc: "See if you are currently marked as Eligible or Not Yet Eligible for clearance.",
      },
      {
        num: 3,
        title: "Check Outstanding Courses & Carryovers",
        desc: "Review any mandatory core courses or failed courses you must clear.",
      },
      {
        num: 4,
        title: "Review Semester Results",
        desc: "Open Results to inspect your semester GPA, CGPA progression, and print reports.",
      },
    ],
  },
  adviser: {
    title: "Adviser Quick Guide",
    subtitle: "Follow these 3 steps to monitor your assigned students:",
    steps: [
      {
        num: 1,
        title: "Open Your Student List",
        desc: "View all students assigned to your cohort or department level.",
      },
      {
        num: 2,
        title: "Filter by Status & Standing",
        desc: "Quickly identify at-risk students, carryovers, or those ready for graduation.",
      },
      {
        num: 3,
        title: "Inspect Academic Progress",
        desc: "Open any student to audit their completed units, CGPA, and course history.",
      },
    ],
  },
  admin: {
    title: "Examination Officer / Admin Quick Guide",
    subtitle: "Follow these 5 steps to administer eligibility records:",
    steps: [
      {
        num: 1,
        title: "Manage Users",
        desc: "Provision student, adviser, and officer accounts with role permissions.",
      },
      {
        num: 2,
        title: "Maintain Sessions & Courses",
        desc: "Set active academic sessions, semesters, credit units, and course levels.",
      },
      {
        num: 3,
        title: "Enter or Import Results",
        desc: "Upload semester score sheets in bulk or enter individual student grades.",
      },
      {
        num: 4,
        title: "Verify Graduation Rules",
        desc: "Review minimum unit thresholds (UTME/DE) and compulsory course requirements.",
      },
      {
        num: 5,
        title: "Monitor Audit Logs",
        desc: "Track all grade modifications, user updates, and administrative changes.",
      },
    ],
  },
};

export function GettingStartedCard({ role, storageKey }: GettingStartedCardProps) {
  const key = storageKey || `aet_guide_dismissed_${role}`;
  const [isDismissed, setIsDismissed] = React.useState<boolean>(true);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(key);
      if (stored !== "true") {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, [key]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(key, "true");
    } catch {
      // Ignore storage errors
    }
  };

  if (!isMounted || isDismissed) {
    return null;
  }

  const guide = roleGuides[role];

  return (
    <div className="relative overflow-hidden rounded-xl border border-jostum-primary/20 bg-gradient-to-br from-jostum-soft/60 via-card to-card p-5 sm:p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-jostum-primary/10 text-jostum-primary dark:bg-jostum-primary/20">
              <HelpCircle className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              {guide.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {guide.subtitle}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss guide"
          title="Dismiss guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {guide.steps.map((step) => (
          <div
            key={step.num}
            className="rounded-lg border bg-card/80 p-3.5 backdrop-blur-xs transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jostum-primary text-[11px] font-bold text-white">
                {step.num}
              </span>
              <h4 className="text-xs font-semibold text-foreground truncate">
                {step.title}
              </h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
        <span>Need in-depth documentation or an academic terms glossary?</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1.5">
            <Link href="/help">
              Visit Help & Glossary <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
