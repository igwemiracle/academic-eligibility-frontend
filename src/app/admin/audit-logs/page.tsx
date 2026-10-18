"use client";

import * as React from "react";
import { format } from "date-fns";
import { History, Shield, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useAdminAuditLogs } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useAdminAuditLogs(page);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              System Audit Trail
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete chronological record of administrative actions, rule modifications, and grade entries.
          </p>
        </div>

        {data && (
          <Badge variant="outline" className="w-fit text-xs font-medium px-3 py-1">
            {data.total} Total Recorded Action{data.total === 1 ? "" : "s"}
          </Badge>
        )}
      </div>

      {/* Audit Logs Table */}
      {isLoading ? (
        <Card className="border shadow-xs p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : error ? (
        <ErrorState
          title="Could not load audit trail"
          message={(error as any)?.message || "Failed to retrieve audit log entries."}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No Audit Logs Recorded"
          description="There are currently no recorded administrative modifications in the system."
          icon={History}
        />
      ) : (
        <Card className="border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[180px]">Action Type</TableHead>
                  <TableHead className="w-[220px]">Performed By</TableHead>
                  <TableHead>Change Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((log) => {
                  let formattedDate = log.timestamp;
                  try {
                    formattedDate = format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss");
                  } catch {
                    // fallback to raw
                  }

                  return (
                    <TableRow key={log.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formattedDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-[10px] font-semibold">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {log.performedBy.fullName}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono truncate">
                              {log.performedBy.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
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
