"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Loader2 } from "@/components/icons";
import { toast } from "sonner";
import { useAdminSessions, useCreateSession } from "@/hooks/use-admin";
import { sessionSchema, SessionFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function AdminSessionsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: sessions, isLoading, error, refetch } = useAdminSessions();
  const createMutation = useCreateSession();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "2024/2025",
      startYear: 2024,
      endYear: 2025,
    },
  });

  const onSubmit = async (values: SessionFormData) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success(`Academic Session ${values.name} created successfully`);
      form.reset();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create academic session");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-jostum-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Academic Sessions
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure university academic calendar years for results grouping and tracking.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Academic Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Academic Session</DialogTitle>
              <DialogDescription>
                Define a new university academic year (e.g. 2024/2025).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Label htmlFor="ses-name" className="text-xs">Session Name</Label>
                <Input
                  id="ses-name"
                  placeholder="2024/2025"
                  className="h-9 font-mono"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-[11px] text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ses-start" className="text-xs">Start Year</Label>
                  <Input
                    id="ses-start"
                    type="number"
                    placeholder="2024"
                    className="h-9"
                    {...form.register("startYear", { valueAsNumber: true })}
                  />
                  {form.formState.errors.startYear && (
                    <p className="text-[11px] text-destructive">
                      {form.formState.errors.startYear.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ses-end" className="text-xs">End Year</Label>
                  <Input
                    id="ses-end"
                    type="number"
                    placeholder="2025"
                    className="h-9"
                    {...form.register("endYear", { valueAsNumber: true })}
                  />
                  {form.formState.errors.endYear && (
                    <p className="text-[11px] text-destructive">
                      {form.formState.errors.endYear.message}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Session"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <Card className="border shadow-xs p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : error ? (
        <ErrorState
          title="Could not load academic sessions"
          message={(error as any)?.message || "Failed to retrieve sessions."}
          onRetry={() => refetch()}
        />
      ) : !sessions || sessions.length === 0 ? (
        <EmptyState
          title="No Academic Sessions"
          description="Create an academic session to begin recording examination results."
          icon={Calendar}
        />
      ) : (
        <Card className="border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Academic Session</TableHead>
                <TableHead className="w-[120px] text-center">Start Year</TableHead>
                <TableHead className="w-[120px] text-center">End Year</TableHead>
                <TableHead className="w-[120px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session, index) => (
                <TableRow key={session.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono font-semibold text-foreground text-sm">
                    {session.name}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {session.startYear}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {session.endYear}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={index === sessions.length - 1 ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {index === sessions.length - 1 ? "Current" : "Archived"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
