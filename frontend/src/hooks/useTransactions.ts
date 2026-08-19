import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionInput,
} from "@/lib/types";

export function useTransactions(filters: TransactionFilters) {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Transaction>>(
        "/api/transactions",
        { params: filters },
      );
      return data;
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      const { data } = await apiClient.post<Transaction>(
        "/api/transactions",
        input,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: TransactionInput;
    }) => {
      const { data } = await apiClient.put<Transaction>(
        `/api/transactions/${id}`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
