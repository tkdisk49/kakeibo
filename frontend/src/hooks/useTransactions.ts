import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionInput,
} from "@/lib/types";

// 収支一覧を取得する（年月・種別・カテゴリで絞り込み）。
// filtersが変わるたびに別クエリとして扱われ、自動で再フェッチされる
export function useTransactions(filters: TransactionFilters) {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Transaction>>(
        "/api/transactions/get-list",
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
        "/api/transactions/create",
        input,
      );
      return data;
    },
    onSuccess: () => {
      // 一覧キャッシュを無効化し、最新の状態を再取得させる
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
      // PUT/PATCHではなくPOSTに統一する方針のため、更新対象のIDはボディに含める
      const { data } = await apiClient.post<Transaction>(
        "/api/transactions/update",
        { transaction_id: id, ...input },
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
      // DELETEではなくPOSTに統一する方針のため、削除対象のIDはボディに含める
      await apiClient.post("/api/transactions/delete", {
        transaction_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
