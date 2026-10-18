"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Upload,
  Download,
  Plus,
  Pencil,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  useAdminResults,
  useAdminSessions,
  useAdminCourses,
  useAdminUsers,
  useCreateResult,
  useUpdateResult,
  useImportResultsCsv,
} from "@/hooks/use-admin";
import { Result, CsvImportResponse } from "@/lib/types";
import {
  singleResultSchema,
  SingleResultFormData,
  editResultSchema,
  EditResultFormData,
} from "@/lib/validation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function AdminResultsPage() {
  const [selectedStudentId, setSelectedStudentId] = React.useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>("");
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [editingResult, setEditingResult] = React.useState<Result | null>(null);
  const [importResult, setImportResult] = React.useState<CsvImportResponse | null>(null);
  const [csvFile, setCsvFile] = React.useState<File | null>(null);

  const { data: usersData } = useAdminUsers({ role: "STUDENT" });
  const { data: sessions } = useAdminSessions();
  const { data: courses } = useAdminCourses();

  // Auto-select first student and session when loaded if none selected
  React.useEffect(() => {
    if (!selectedStudentId && usersData?.items && usersData.items.length > 0) {
      setSelectedStudentId(usersData.items[0].id);
    }
  }, [usersData, selectedStudentId]);

  React.useEffect(() => {
    if (!selectedSessionId && sessions && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const {
    data: results,
    isLoading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useAdminResults({
    studentId: selectedStudentId,
    sessionId: selectedSessionId,
  });

  const createMutation = useCreateResult();
  const updateMutation = useUpdateResult();
  const importMutation = useImportResultsCsv();

  // Add single result form
  const addForm = useForm<SingleResultFormData>({
    resolver: zodResolver(singleResultSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
      sessionId: "",
      score: 70,
    },
  });

  // Edit single result form
  const editForm = useForm<EditResultFormData>({
    resolver: zodResolver(editResultSchema),
    defaultValues: {
      score: 70,
    },
  });

  const openAddDialog = () => {
    addForm.reset({
      studentId: selectedStudentId,
      sessionId: selectedSessionId,
      courseId: courses?.[0]?.id || "",
      score: 70,
    });
    setAddDialogOpen(true);
  };

  const openEditDialog = (result: Result) => {
    setEditingResult(result);
    editForm.reset({
      score: result.score,
    });
    setEditDialogOpen(true);
  };

  const onAddSubmit = async (values: SingleResultFormData) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Course result recorded successfully");
      setAddDialogOpen(false);
      refetchResults();
    } catch (err: any) {
      toast.error(err?.message || "Failed to record result");
    }
  };

  const onEditSubmit = async (values: EditResultFormData) => {
    if (!editingResult) return;
    try {
      await updateMutation.mutateAsync({
        id: editingResult.id,
        score: values.score,
      });
      toast.success("Result score updated successfully");
      setEditDialogOpen(false);
      refetchResults();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update score");
    }
  };

  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "matricNumber,courseCode,session,score\n" +
      "CSC/2020/001,CMP 499,2023/2024,85\n" +
      "CSC/2020/002,CMP 211,2023/2024,68\n" +
      "CSC/2021/DE01,CMP 311,2023/2024,74\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "results_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("CSV template downloaded: matricNumber,courseCode,session,score");
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Please select a valid CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await importMutation.mutateAsync(formData);
      setImportResult(res);
      toast.success(`Import complete: ${res.imported} imported, ${res.skipped} skipped`);
      setCsvFile(null);
      refetchResults();
    } catch (err: any) {
      toast.error(err?.message || "Failed to import CSV");
    }
  };

  const studentOptions = usersData?.items || [];
  const selectedStudent = studentOptions.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Academic Results & CSV Import
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter individual student examination scores or batch-import results via CSV spreadsheet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadCsvTemplate}
            className="gap-2 text-xs"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setImportResult(null);
              setImportDialogOpen(true);
            }}
            className="gap-2 text-xs"
          >
            <Upload className="h-4 w-4" />
            Batch Import CSV
          </Button>

          <Button
            onClick={openAddDialog}
            disabled={!selectedStudentId || !selectedSessionId}
            className="gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            Add Single Result
          </Button>
        </div>
      </div>

      {/* Picker Controls: Student & Session */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Student</Label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a student..." />
                </SelectTrigger>
                <SelectContent>
                  {studentOptions.map((std) => (
                    <SelectItem key={std.id} value={std.id}>
                      {std.fullName} ({std.matricNumber || std.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Academic Session</Label>
              <Select
                value={selectedSessionId}
                onValueChange={setSelectedSessionId}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick a session..." />
                </SelectTrigger>
                <SelectContent>
                  {(sessions || []).map((ses) => (
                    <SelectItem key={ses.id} value={ses.id}>
                      Session {ses.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {resultsLoading ? (
        <Card className="border shadow-xs p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : resultsError ? (
        <ErrorState
          title="Could not load session results"
          message={(resultsError as any)?.message || "Failed to retrieve student marks."}
          onRetry={() => refetchResults()}
        />
      ) : !results || results.length === 0 ? (
        <EmptyState
          title="No Results Found for this Session"
          description={
            selectedStudent
              ? `No course scores recorded for ${selectedStudent.fullName} in the selected session.`
              : "Select a student and session above to inspect or add results."
          }
          icon={Award}
          action={{
            label: "Add Result for Student",
            onClick: openAddDialog,
          }}
        />
      ) : (
        <Card className="border shadow-xs overflow-hidden">
          <CardHeader className="bg-muted/30 py-3 px-6 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Recorded Course Grades: {selectedStudent?.fullName}
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                {selectedStudent?.matricNumber}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {results.length} result(s)
            </Badge>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="w-[120px]">Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="w-[70px] text-center">Units</TableHead>
                  <TableHead className="w-[80px] text-center">Score</TableHead>
                  <TableHead className="w-[80px] text-center">Grade</TableHead>
                  <TableHead className="w-[90px] text-center">Points</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="w-[90px] text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((res) => (
                  <TableRow key={res.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono font-bold text-xs text-foreground">
                      {res.course.code}
                    </TableCell>
                    <TableCell className="text-xs">{res.course.title}</TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {res.course.units}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs font-semibold">
                      {res.score}%
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs font-bold">
                      {res.grade}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {res.gradePoint}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={res.passed ? "success" : "destructive"}
                        className="text-[10px]"
                      >
                        {res.passed ? "Pass" : "Fail"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => openEditDialog(res)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add Single Result Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Course Grade</DialogTitle>
            <DialogDescription>
              Assign an official examination score to {selectedStudent?.fullName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="res-course" className="text-xs">Curriculum Course</Label>
              <Select
                value={addForm.watch("courseId")}
                onValueChange={(val) => addForm.setValue("courseId", val)}
              >
                <SelectTrigger id="res-course" className="h-9">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {(courses || []).map((crs) => (
                    <SelectItem key={crs.id} value={crs.id}>
                      {crs.code} - {crs.title} ({crs.units} units)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-score" className="text-xs">Exam Score (0 - 100)</Label>
              <Input
                id="res-score"
                type="number"
                min={0}
                max={100}
                className="h-9"
                {...addForm.register("score", { valueAsNumber: true })}
              />
              {addForm.formState.errors.score && (
                <p className="text-[11px] text-destructive">
                  {addForm.formState.errors.score.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Record Score"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Result Score Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Score</DialogTitle>
            <DialogDescription>
              Update marks for {editingResult?.course.code} ({editingResult?.course.title}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="edit-score" className="text-xs">New Score (0 - 100)</Label>
              <Input
                id="edit-score"
                type="number"
                min={0}
                max={100}
                className="h-9"
                {...editForm.register("score", { valueAsNumber: true })}
              />
              {editForm.formState.errors.score && (
                <p className="text-[11px] text-destructive">
                  {editForm.formState.errors.score.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Save Score"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Import CSV Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Batch Import Examination Results
            </DialogTitle>
            <DialogDescription>
              Upload a UTF-8 encoded CSV file matching columns:{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                matricNumber,courseCode,session,score
              </code>
            </DialogDescription>
          </DialogHeader>

          {!importResult ? (
            <form onSubmit={handleCsvImport} className="space-y-4 pt-2">
              <div className="rounded-lg border-2 border-dashed p-6 text-center hover:bg-muted/20 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <Label
                  htmlFor="csv-upload"
                  className="cursor-pointer text-sm font-semibold text-primary hover:underline block"
                >
                  {csvFile ? csvFile.name : "Choose CSV file to upload"}
                </Label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCsvFile(e.target.files[0]);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepts standard comma-separated .csv format
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span>Need formatting reference?</span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleDownloadCsvTemplate}
                  className="h-auto p-0 text-xs"
                >
                  Download template CSV
                </Button>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImportDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!csvFile || importMutation.isPending}
                  className="gap-2"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing Results...
                    </>
                  ) : (
                    "Upload & Process CSV"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4 py-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-center">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">
                    Imported Successfully
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                    {importResult.imported}
                  </span>
                </div>
                <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-3 text-center">
                  <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block">
                    Skipped / Errors
                  </span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                    {importResult.skipped}
                  </span>
                </div>
              </div>

              {/* Per-Row Errors Table if any */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-destructive block">
                    Row-Level Discrepancies ({importResult.errors.length}):
                  </span>
                  <div className="max-h-48 overflow-y-auto rounded-md border text-xs">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-[60px]">Row</TableHead>
                          <TableHead>Error Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResult.errors.map((err, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-destructive font-semibold">
                              #{err.row}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {err.message}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  onClick={() => {
                    setImportDialogOpen(false);
                    setImportResult(null);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
