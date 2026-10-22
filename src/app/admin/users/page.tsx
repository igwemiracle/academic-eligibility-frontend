"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  KeyRound,
  UserX,
  UserCheck,
  Loader2,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from "@/components/icons";
import { toast } from "sonner";
import {
  useAdminUsers,
  useCreateUser,
  useResetPassword,
  useDeactivateUser,
  useReactivateUser,
  useAssignAdviser,
} from "@/hooks/use-admin";
import { Role, User } from "@/lib/types";
import {
  studentUserSchema,
  StudentUserFormData,
  adviserUserSchema,
  AdviserUserFormData,
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
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState, EmptyState } from "@/components/shared/state-indicators";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = React.useState<User | null>(null);
  const [newPassword, setNewPassword] = React.useState("Password123!");
  const [showResetPassword, setShowResetPassword] = React.useState(false);
  const [selectedStudentForAdviser, setSelectedStudentForAdviser] = React.useState<User | null>(null);
  const [selectedAdviserId, setSelectedAdviserId] = React.useState("");

  const { data, isLoading, error, refetch } = useAdminUsers({
    search: search.trim(),
    role: roleFilter === "ALL" ? "" : roleFilter,
  });

  // Dedicated query to fetch all active faculty advisers for assignment dialogs
  const { data: allAdvisersData, isLoading: advisersLoading } = useAdminUsers({
    role: "ADVISER",
    pageSize: 100,
  });

  const createUserMutation = useCreateUser();
  const resetPasswordMutation = useResetPassword();
  const deactivateUserMutation = useDeactivateUser();
  const reactivateUserMutation = useReactivateUser();
  const assignAdviserMutation = useAssignAdviser();

  // Student Form
  const studentForm = useForm<StudentUserFormData>({
    resolver: zodResolver(studentUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "Password123!",
      matricNumber: "",
      level: 100,
      entryYear: 2024,
      entryMode: "UTME",
    },
  });

  // Adviser Form
  const adviserForm = useForm<AdviserUserFormData>({
    resolver: zodResolver(adviserUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "Password123!",
    },
  });

  const onStudentSubmit = async (values: StudentUserFormData) => {
    try {
      await createUserMutation.mutateAsync({
        ...values,
        role: "STUDENT",
      });
      toast.success(`Student ${values.fullName} created successfully`);
      studentForm.reset();
      setCreateDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create student account");
    }
  };

  const onAdviserSubmit = async (values: AdviserUserFormData) => {
    try {
      await createUserMutation.mutateAsync({
        ...values,
        role: "ADVISER",
      });
      toast.success(`Adviser ${values.fullName} created successfully`);
      adviserForm.reset();
      setCreateDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create adviser account");
    }
  };

  const handleOpenResetDialog = (user: User) => {
    setSelectedUserForReset(user);
    setNewPassword("Password123!");
    setShowResetPassword(false);
    setResetDialogOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUserForReset) return;
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        userId: selectedUserForReset.id,
        newPassword,
      });
      toast.success(`Password for ${selectedUserForReset.fullName} has been reset successfully`);
      setResetDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    }
  };

  const handleDeactivate = async (user: User) => {
    if (confirm(`Deactivate account for ${user.fullName}?`)) {
      try {
        await deactivateUserMutation.mutateAsync(user.id);
        toast.success(`User ${user.fullName} deactivated`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to deactivate user");
      }
    }
  };

  const handleReactivate = async (user: User) => {
    if (confirm(`Reactivate account for ${user.fullName} (${user.email})?`)) {
      try {
        await reactivateUserMutation.mutateAsync(user.id);
        toast.success(`User ${user.fullName} reactivated successfully`);
      } catch (err: any) {
        toast.error(err?.message || "Failed to reactivate user");
      }
    }
  };

  const handleAssignAdviser = async () => {
    if (!selectedStudentForAdviser || !selectedAdviserId) {
      toast.error("Please select an adviser");
      return;
    }
    try {
      await assignAdviserMutation.mutateAsync({
        studentId: selectedStudentForAdviser.id,
        adviserId: selectedAdviserId,
      });
      toast.success(`Adviser assigned to ${selectedStudentForAdviser.fullName}`);
      setAssignDialogOpen(false);
      setSelectedStudentForAdviser(null);
      setSelectedAdviserId("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to assign adviser");
    }
  };

  const advisersList = allAdvisersData?.items || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-jostum-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              User Directory & Roles
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage students, academic advisers, and administrative credentials.
          </p>
        </div>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Account</DialogTitle>
              <DialogDescription>
                Create a new student or academic adviser profile.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="student">Student Account</TabsTrigger>
                <TabsTrigger value="adviser">Adviser Account</TabsTrigger>
              </TabsList>

              {/* Student Form Tab */}
              <TabsContent value="student">
                <form
                  onSubmit={studentForm.handleSubmit(onStudentSubmit)}
                  className="space-y-3"
                  noValidate
                >
                  <div className="space-y-1">
                    <Label htmlFor="std-name" className="text-xs">Full Name</Label>
                    <Input
                      id="std-name"
                      placeholder="e.g. Adebayo Olawale"
                      className="h-9"
                      {...studentForm.register("fullName")}
                    />
                    {studentForm.formState.errors.fullName && (
                      <p className="text-[11px] text-destructive">
                        {studentForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="std-email" className="text-xs">Institutional Email</Label>
                    <Input
                      id="std-email"
                      type="email"
                      placeholder="student@cs.edu.ng"
                      className="h-9"
                      {...studentForm.register("email")}
                    />
                    {studentForm.formState.errors.email && (
                      <p className="text-[11px] text-destructive">
                        {studentForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="std-matric" className="text-xs">Matric Number</Label>
                      <Input
                        id="std-matric"
                        placeholder="CSC/2024/001"
                        className="h-9"
                        {...studentForm.register("matricNumber")}
                      />
                      {studentForm.formState.errors.matricNumber && (
                        <p className="text-[11px] text-destructive">
                          {studentForm.formState.errors.matricNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="std-level" className="text-xs">Study Level</Label>
                      <Input
                        id="std-level"
                        type="number"
                        placeholder="100"
                        className="h-9"
                        {...studentForm.register("level", { valueAsNumber: true })}
                      />
                      {studentForm.formState.errors.level && (
                        <p className="text-[11px] text-destructive">
                          {studentForm.formState.errors.level.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="std-entryYear" className="text-xs">Entry Year</Label>
                      <Input
                        id="std-entryYear"
                        type="number"
                        placeholder="2024"
                        className="h-9"
                        {...studentForm.register("entryYear", { valueAsNumber: true })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="std-entryMode" className="text-xs">Entry Mode</Label>
                      <Select
                        defaultValue="UTME"
                        onValueChange={(val: any) =>
                          studentForm.setValue("entryMode", val)
                        }
                      >
                        <SelectTrigger id="std-entryMode" className="h-9">
                          <SelectValue placeholder="Entry Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTME">UTME (166 Units)</SelectItem>
                          <SelectItem value="DIRECT_ENTRY">Direct Entry (121 Units)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="std-pwd" className="text-xs">Default Password</Label>
                    <Input
                      id="std-pwd"
                      type="password"
                      className="h-9"
                      {...studentForm.register("password")}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="w-full"
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating Student...
                        </>
                      ) : (
                        "Create Student Profile"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>

              {/* Adviser Form Tab */}
              <TabsContent value="adviser">
                <form
                  onSubmit={adviserForm.handleSubmit(onAdviserSubmit)}
                  className="space-y-3"
                  noValidate
                >
                  <div className="space-y-1">
                    <Label htmlFor="adv-name" className="text-xs">Full Name</Label>
                    <Input
                      id="adv-name"
                      placeholder="e.g. Dr. Ngozi Okonjo"
                      className="h-9"
                      {...adviserForm.register("fullName")}
                    />
                    {adviserForm.formState.errors.fullName && (
                      <p className="text-[11px] text-destructive">
                        {adviserForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="adv-email" className="text-xs">Institutional Email</Label>
                    <Input
                      id="adv-email"
                      type="email"
                      placeholder="adviser@cs.edu.ng"
                      className="h-9"
                      {...adviserForm.register("email")}
                    />
                    {adviserForm.formState.errors.email && (
                      <p className="text-[11px] text-destructive">
                        {adviserForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="adv-pwd" className="text-xs">Initial Password</Label>
                    <Input
                      id="adv-pwd"
                      type="password"
                      className="h-9"
                      {...adviserForm.register("password")}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="w-full"
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating Adviser...
                        </>
                      ) : (
                        "Create Adviser Profile"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Card */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by full name or email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="ADVISER">Academic Advisers</SelectItem>
                  <SelectItem value="ADMIN">Examination Officers / Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <Card className="border shadow-xs p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : error ? (
        <ErrorState
          title="Could not load users"
          message={(error as any)?.message || "Failed to retrieve user accounts."}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="No user accounts match your search and filter criteria."
          icon={Users}
        />
      ) : (
        <Card className="border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="w-[100px] text-center">Role</TableHead>
                  <TableHead className="w-[140px]">Matric / Details</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                      {user.fullName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "destructive"
                            : user.role === "ADVISER"
                            ? "info"
                            : "secondary"
                        }
                        className="text-[10px] font-semibold"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.role === "STUDENT" ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-foreground font-medium block">
                            {user.matricNumber || "No matric"}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {user.level}L • {user.entryMode === "DIRECT_ENTRY" ? "DE" : "UTME"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={user.isActive !== false ? "success" : "outline"}
                        className="text-[10px]"
                      >
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.role === "STUDENT" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            title="Assign Adviser"
                            onClick={() => {
                              setSelectedStudentForAdviser(user);
                              setAssignDialogOpen(true);
                            }}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          title="Reset Password"
                          onClick={() => handleOpenResetDialog(user)}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        {user.isActive === false ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-jostum-primary hover:text-jostum-primary hover:bg-jostum-soft/40"
                            title="Reactivate Account"
                            onClick={() => handleReactivate(user)}
                            disabled={reactivateUserMutation.isPending}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                            title="Deactivate Account"
                            onClick={() => handleDeactivate(user)}
                            disabled={deactivateUserMutation.isPending}
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Assign Adviser Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Academic Adviser</DialogTitle>
            <DialogDescription>
              Assign a departmental faculty member to monitor{" "}
              <strong>{selectedStudentForAdviser?.fullName}</strong> ({selectedStudentForAdviser?.matricNumber}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="adv-select" className="text-xs font-medium">Select Faculty Adviser</Label>
            <Select
              value={selectedAdviserId}
              onValueChange={setSelectedAdviserId}
            >
              <SelectTrigger id="adv-select" className="h-10">
                <SelectValue placeholder={advisersLoading ? "Loading advisers..." : "Choose an adviser..."} />
              </SelectTrigger>
              <SelectContent>
                {advisersLoading ? (
                  <SelectItem value="_loading" disabled>
                    Loading departmental advisers...
                  </SelectItem>
                ) : advisersList.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No faculty advisers found
                  </SelectItem>
                ) : (
                  advisersList.map((adv) => (
                    <SelectItem key={adv.id} value={adv.id}>
                      {adv.fullName} ({adv.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignAdviser}
              disabled={assignAdviserMutation.isPending || !selectedAdviserId}
            >
              {assignAdviserMutation.isPending ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-jostum-primary" />
              Reset User Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{selectedUserForReset?.fullName}</strong> ({selectedUserForReset?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="reset-new-password" className="text-xs font-medium">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-new-password"
                type={showResetPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="pl-9 pr-10"
                disabled={resetPasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowResetPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
                aria-label={showResetPassword ? "Hide password" : "Show password"}
              >
                {showResetPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              The password must be at least 8 characters long. A temporary default is pre-filled.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
              disabled={resetPasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmResetPassword}
              disabled={resetPasswordMutation.isPending || !newPassword || newPassword.length < 8}
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Confirm Password Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
