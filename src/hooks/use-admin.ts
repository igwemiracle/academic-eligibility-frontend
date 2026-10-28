import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  AdminStats,
  AcademicSession,
  AuditLogsResponse,
  Course,
  CsvImportResponse,
  Requirements,
  Result,
  User,
} from "@/lib/types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<AdminStats>("/admin/stats"),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminUsers(params: { role?: string; search?: string; page?: number; pageSize?: number } = {}) {
  const { role = "", search = "", page = 1, pageSize = 20 } = params;

  return useQuery({
    queryKey: ["admin", "users", { role, search, page, pageSize }],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (role) searchParams.append("role", role);
      if (search) searchParams.append("search", search);
      searchParams.append("page", page.toString());
      if (pageSize) searchParams.append("pageSize", pageSize.toString());
      return api.get<{ items: User[]; total: number }>(`/admin/users?${searchParams.toString()}`);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: any) => api.post<User>("/admin/users", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      api.post(`/admin/users/${userId}/reset-password`, { newPassword }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}`, { isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAssignAdviser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, adviserId }: { studentId: string; adviserId: string }) =>
      api.post(`/admin/students/${studentId}/adviser`, { adviserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => api.get<Course[]>("/admin/courses"),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (course: Partial<Course>) => api.post<Course>("/admin/courses", course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      api.patch<Course>(`/admin/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useAdminSessions() {
  return useQuery({
    queryKey: ["admin", "sessions"],
    queryFn: () => api.get<AcademicSession[]>("/admin/sessions"),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session: Partial<AcademicSession>) =>
      api.post<AcademicSession>("/admin/sessions", session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });
    },
  });
}

export function useAdminResults(params: { studentId?: string; sessionId?: string } = {}) {
  const { studentId = "", sessionId = "" } = params;
  return useQuery({
    queryKey: ["admin", "results", { studentId, sessionId }],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (studentId) searchParams.append("studentId", studentId);
      if (sessionId) searchParams.append("sessionId", sessionId);
      return api.get<Result[]>(`/admin/results?${searchParams.toString()}`);
    },
    enabled: Boolean(studentId && sessionId),
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { studentId: string; courseId: string; sessionId: string; score: number }) =>
      api.post("/admin/results", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "results"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["adviser"] });
    },
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      api.patch(`/admin/results/${id}`, { score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "results"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["adviser"] });
    },
  });
}

export function useImportResultsCsv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.upload<CsvImportResponse>("/admin/results/import", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "results"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminRequirements() {
  return useQuery({
    queryKey: ["admin", "requirements"],
    queryFn: () => api.get<Requirements>("/admin/requirements"),
  });
}

export function useUpdateRequirements() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requirements: Partial<Requirements>) =>
      api.put<Requirements>("/admin/requirements", requirements),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "requirements"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["adviser"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminAuditLogs(page: number = 1) {
  return useQuery({
    queryKey: ["admin", "audit-logs", page],
    queryFn: () => api.get<AuditLogsResponse>(`/admin/audit-logs?page=${page}`),
  });
}
