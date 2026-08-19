import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ensureCsrfCookie } from "@/lib/api-client";
import type { User } from "@/lib/types";

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<User>("/api/user");
        return data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      await ensureCsrfCookie();
      const { data } = await apiClient.post<User>("/api/login", input);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      await ensureCsrfCookie();
      const { data } = await apiClient.post<User>("/api/register", input);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
}
