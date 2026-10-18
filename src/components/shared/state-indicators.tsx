import * as React from "react";
import { AlertCircle, RefreshCw, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while communicating with the university servers.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center text-card-foreground shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 gap-2 border-destructive/30 hover:bg-destructive/10"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Request
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderSearch,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 p-10 text-center ${
        className || ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Student Profile banner skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-6 shadow-xs">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </div>

      {/* Large Status Card Skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />

      {/* Three Checks Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>

      {/* Tables & Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}
