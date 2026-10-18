import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<{ user: User }>("/auth/me");
      return res.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.post<{ user: User }>("/auth/login", credentials);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      if (user.role === "STUDENT") {
        router.push("/student");
      } else if (user.role === "ADVISER") {
        router.push("/adviser");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/login");
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      return api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwords: { currentPassword: string; newPassword: string }) => {
      return api.post("/auth/change-password", passwords);
    },
  });
}
