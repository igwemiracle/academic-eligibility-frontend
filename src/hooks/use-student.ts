import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProgressSummary, StudentResultsResponse } from "@/lib/types";

export function useStudentProgress() {
  return useQuery({
    queryKey: ["student", "progress"],
    queryFn: () => api.get<ProgressSummary>("/me/progress"),
    placeholderData: (previousData) => previousData,
  });
}

export function useStudentResults() {
  return useQuery({
    queryKey: ["student", "results"],
    queryFn: () => api.get<StudentResultsResponse>("/me/results"),
    placeholderData: (previousData) => previousData,
  });
}
