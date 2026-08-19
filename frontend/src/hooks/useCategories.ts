import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/lib/types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>(
        "/api/categories/get-list",
      );
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
}
