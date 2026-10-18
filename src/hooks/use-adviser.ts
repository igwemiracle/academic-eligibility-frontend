import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  AdviserStudentsResponse,
  ProgressSummary,
  StudentResultsResponse,
} from "@/lib/types";

export interface AdviserStudentQueryParams {
  status?: string;
  level?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useAdviserStudents(params: AdviserStudentQueryParams = {}) {
  const { status = "", level = "", search = "", page = 1, pageSize = 10 } = params;

  return useQuery({
    queryKey: ["adviser", "students", { status, level, search, page, pageSize }],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (status) searchParams.append("status", status);
      if (level) searchParams.append("level", level);
      if (search) searchParams.append("search", search);
      searchParams.append("page", page.toString());
      searchParams.append("pageSize", pageSize.toString());

      return api.get<AdviserStudentsResponse>(
        `/adviser/students?${searchParams.toString()}`
      );
    },
  });
}

export function useAdviserStudentProgress(studentId: string) {
  return useQuery({
    queryKey: ["adviser", "student", studentId, "progress"],
    queryFn: () =>
      api.get<ProgressSummary>(`/adviser/students/${studentId}/progress`),
    enabled: Boolean(studentId),
  });
}

export function useAdviserStudentResults(studentId: string) {
  return useQuery({
    queryKey: ["adviser", "student", studentId, "results"],
    queryFn: () =>
      api.get<StudentResultsResponse>(`/adviser/students/${studentId}/results`),
    enabled: Boolean(studentId),
  });
}
