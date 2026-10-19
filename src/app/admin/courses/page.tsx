"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
} from "@/components/icons";
import { toast } from "sonner";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/use-admin";
import { Course } from "@/lib/types";
import { courseSchema, CourseFormData } from "@/lib/validation";
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

export default function AdminCoursesPage() {
  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState("ALL");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  const { data: courses, isLoading, error, refetch } = useAdminCourses();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      title: "",
      units: 3,
      level: 100,
      semester: 1,
      isCompulsory: true,
    },
  });

  const openAddDialog = () => {
    setEditingCourse(null);
    form.reset({
      code: "",
      title: "",
      units: 3,
      level: 100,
      semester: 1,
      isCompulsory: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    form.reset({
      code: course.code,
      title: course.title,
      units: course.units,
      level: course.level,
      semester: course.semester,
      isCompulsory: course.isCompulsory,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: CourseFormData) => {
    try {
      if (editingCourse) {
        await updateMutation.mutateAsync({
          id: editingCourse.id,
          data: {
            ...values,
            semester: values.semester as 1 | 2,
          },
        });
        toast.success(`Course ${values.code} updated successfully`);
      } else {
        await createMutation.mutateAsync({
          ...values,
          semester: values.semester as 1 | 2,
        });
        toast.success(`Course ${values.code} added to curriculum`);
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save course");
    }
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Are you sure you want to delete ${course.code} (${course.title})?`)) {
      try {
        await deleteMutation.mutateAsync(course.id);
        toast.success(`Course ${course.code} removed`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete course");
      }
    }
  };

  const filteredCourses = (courses || []).filter((c) => {
    const matchSearch =
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "ALL" || c.level.toString() === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Curriculum Course Catalog
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage departmental curriculum courses, credit units, and compulsory requirements.
          </p>
        </div>

        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by course code or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Table */}
      {isLoading ? (
        <Card className="border shadow-xs p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : error ? (
        <ErrorState
          title="Could not load course catalog"
          message={(error as any)?.message || "Failed to retrieve courses."}
          onRetry={() => refetch()}
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="No curriculum courses match the current query or filter."
          icon={BookOpen}
        />
      ) : (
        <Card className="border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[120px]">Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="w-[70px] text-center">Units</TableHead>
                  <TableHead className="w-[80px] text-center">Level</TableHead>
                  <TableHead className="w-[100px] text-center">Semester</TableHead>
                  <TableHead className="w-[130px] text-center">Requirement</TableHead>
                  <TableHead className="w-[110px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono font-bold text-xs text-foreground">
                      {course.code}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{course.title}</TableCell>
                    <TableCell className="text-center font-mono text-xs font-semibold">
                      {course.units}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {course.level}L
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {course.semester === 1 ? "First" : "Second"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={course.isCompulsory ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {course.isCompulsory ? "Compulsory" : "Elective"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => openEditDialog(course)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(course)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add / Edit Course Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Curriculum Course" : "Add Course to Curriculum"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? `Update course specifications for ${editingCourse.code}.`
                : "Register a new departmental course code and units."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 space-y-1">
                <Label htmlFor="crs-code" className="text-xs">Course Code</Label>
                <Input
                  id="crs-code"
                  placeholder="CMP 111"
                  className="h-9 font-mono"
                  {...form.register("code")}
                />
                {form.formState.errors.code && (
                  <p className="text-[11px] text-destructive">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-1">
                <Label htmlFor="crs-title" className="text-xs">Course Title</Label>
                <Input
                  id="crs-title"
                  placeholder="Introduction to Computer Science"
                  className="h-9"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-[11px] text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="crs-units" className="text-xs">Credit Units</Label>
                <Input
                  id="crs-units"
                  type="number"
                  min={1}
                  max={6}
                  className="h-9"
                  {...form.register("units", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="crs-level" className="text-xs">Level</Label>
                <Select
                  value={form.watch("level")?.toString() || "100"}
                  onValueChange={(val) => form.setValue("level", parseInt(val, 10))}
                >
                  <SelectTrigger id="crs-level" className="h-9">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="crs-sem" className="text-xs">Semester</Label>
                <Select
                  value={form.watch("semester")?.toString() || "1"}
                  onValueChange={(val) => form.setValue("semester", parseInt(val, 10) as 1 | 2)}
                >
                  <SelectTrigger id="crs-sem" className="h-9">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compulsory Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isCompulsory"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...form.register("isCompulsory")}
              />
              <Label htmlFor="isCompulsory" className="text-xs cursor-pointer">
                Compulsory Course (Students must pass this course to graduate)
              </Label>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : editingCourse ? (
                  "Update Course"
                ) : (
                  "Add Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
