"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sliders,
  AlertTriangle,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRequirements, useUpdateRequirements } from "@/hooks/use-admin";
import { requirementsSchema, RequirementsFormData } from "@/lib/validation";
import { Requirements } from "@/lib/types";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRequirementsPage() {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [pendingValues, setPendingValues] = React.useState<RequirementsFormData | null>(null);

  const { data: requirements, isLoading, error, refetch } = useAdminRequirements();
  const updateMutation = useUpdateRequirements();

  const form = useForm<RequirementsFormData>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: {
      minTotalUnits: {
        UTME: 166,
        DIRECT_ENTRY: 121,
      },
      minCgpa: 1.0,
      passMark: 40,
      maxOutstandingCompulsory: 0,
      gradeScale: [
        { minScore: 70, grade: "A", point: 5 },
        { minScore: 60, grade: "B", point: 4 },
        { minScore: 50, grade: "C", point: 3 },
        { minScore: 45, grade: "D", point: 2 },
        { minScore: 40, grade: "E", point: 1 },
        { minScore: 0, grade: "F", point: 0 },
      ],
      degreeClasses: [
        { minCgpa: 4.5, label: "First Class Honours" },
        { minCgpa: 3.5, label: "Second Class Honours (Upper Division)" },
        { minCgpa: 2.4, label: "Second Class Honours (Lower Division)" },
        { minCgpa: 1.5, label: "Third Class Honours" },
        { minCgpa: 1.0, label: "Pass" },
      ],
    },
  });

  // Populate form with existing requirements
  React.useEffect(() => {
    if (requirements) {
      form.reset({
        minTotalUnits: {
          UTME: requirements.minTotalUnits?.UTME ?? 166,
          DIRECT_ENTRY: requirements.minTotalUnits?.DIRECT_ENTRY ?? 121,
        },
        minCgpa: requirements.minCgpa ?? 1.0,
        passMark: requirements.passMark ?? 40,
        maxOutstandingCompulsory: requirements.maxOutstandingCompulsory ?? 0,
        gradeScale: requirements.gradeScale || [],
        degreeClasses: requirements.degreeClasses || [],
      });
    }
  }, [requirements, form]);

  const { fields: gradeScaleFields } = useFieldArray({
    control: form.control,
    name: "gradeScale",
  });

  const { fields: degreeClassFields } = useFieldArray({
    control: form.control,
    name: "degreeClasses",
  });

  const handlePreSubmit = (values: RequirementsFormData) => {
    setPendingValues(values);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingValues) return;
    try {
      await updateMutation.mutateAsync(pendingValues);
      toast.success("Graduation eligibility requirements updated successfully");
      setConfirmDialogOpen(false);
      setPendingValues(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update requirements");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !requirements) {
    return (
      <ErrorState
        title="Could not load requirements"
        message={(error as any)?.message || "Failed to retrieve department requirements."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sliders className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Graduation Requirements & Evaluation Policy
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Define the formal graduation eligibility criteria, grade thresholds, and degree classification cutoffs.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handlePreSubmit)} className="space-y-6" noValidate>
        {/* Core Unit Thresholds & CGPA Card */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">1. Unit & CGPA Thresholds</CardTitle>
            <CardDescription className="text-xs">
              Baseline academic prerequisites according to the departmental handbook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="req-utme" className="text-xs font-semibold">
                  Minimum Total Units (UTME Entry)
                </Label>
                <Input
                  id="req-utme"
                  type="number"
                  min={100}
                  className="h-9"
                  {...form.register("minTotalUnits.UTME", { valueAsNumber: true })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Default: 166 units for 4-year UTME curriculum
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="req-de" className="text-xs font-semibold">
                  Minimum Total Units (Direct Entry)
                </Label>
                <Input
                  id="req-de"
                  type="number"
                  min={80}
                  className="h-9"
                  {...form.register("minTotalUnits.DIRECT_ENTRY", { valueAsNumber: true })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Default: 121 units (exempt from 100-level courses)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="req-cgpa" className="text-xs font-semibold">
                  Minimum CGPA for Graduation
                </Label>
                <Input
                  id="req-cgpa"
                  type="number"
                  step="0.01"
                  min={0}
                  max={5}
                  className="h-9"
                  {...form.register("minCgpa", { valueAsNumber: true })}
                />
                <p className="text-[11px] text-muted-foreground">Default: 1.00</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="req-pass" className="text-xs font-semibold">
                  Course Pass Mark (%)
                </Label>
                <Input
                  id="req-pass"
                  type="number"
                  min={0}
                  max={100}
                  className="h-9"
                  {...form.register("passMark", { valueAsNumber: true })}
                />
                <p className="text-[11px] text-muted-foreground">Default: 40% (Grade E)</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="req-comp" className="text-xs font-semibold">
                  Max Allowed Outstanding Compulsory
                </Label>
                <Input
                  id="req-comp"
                  type="number"
                  min={0}
                  className="h-9"
                  {...form.register("maxOutstandingCompulsory", { valueAsNumber: true })}
                />
                <p className="text-[11px] text-muted-foreground">Default: 0 (All must be passed)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Scale Card */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">2. Grade Point Scale</CardTitle>
            <CardDescription className="text-xs">
              Score ranges, assigned letter grades, and grade point weightings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[100px]">Grade</TableHead>
                  <TableHead>Minimum Score (%)</TableHead>
                  <TableHead className="w-[120px] text-right">Grade Point</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeScaleFields.map((field, idx) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-mono font-bold text-sm">
                      {form.watch(`gradeScale.${idx}.grade`)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="h-8 max-w-[120px]"
                        {...form.register(`gradeScale.${idx}.minScore`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        className="h-8 max-w-[80px] ml-auto text-right font-mono"
                        {...form.register(`gradeScale.${idx}.point`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Degree Class Bands Card */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">3. Degree Classification Cutoffs</CardTitle>
            <CardDescription className="text-xs">
              Minimum CGPA boundaries for university degree classifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Class of Degree</TableHead>
                  <TableHead className="w-[160px] text-right">Minimum CGPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {degreeClassFields.map((field, idx) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {form.watch(`degreeClasses.${idx}.label`)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={5}
                        className="h-8 max-w-[100px] ml-auto text-right font-mono"
                        {...form.register(`degreeClasses.${idx}.minCgpa`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="gap-2"
            disabled={updateMutation.isPending}
          >
            <Save className="h-4 w-4" />
            Save Graduation Requirements
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog before Saving */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base sm:text-lg">
              Confirm Department Rule Changes
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Modifying these requirements will immediately trigger a recalculation of graduation eligibility status for <strong>every student</strong> registered in the Department of Computer Science.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">UTME Required Units:</span>
              <span className="font-semibold">{pendingValues?.minTotalUnits.UTME}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Direct Entry Required Units:</span>
              <span className="font-semibold">{pendingValues?.minTotalUnits.DIRECT_ENTRY}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum CGPA:</span>
              <span className="font-semibold">{pendingValues?.minCgpa?.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              onClick={handleConfirmSave}
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Applying Changes...
                </>
              ) : (
                "Confirm & Recalculate All"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
