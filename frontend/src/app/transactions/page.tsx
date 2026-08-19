"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLogout, useUser } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/hooks/useTransactions";
import type { Transaction, TransactionFilters as Filters } from "@/lib/types";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

export default function TransactionsPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const logout = useLogout();

  const now = new Date();
  const [filters, setFilters] = useState<Filters>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | null | undefined
  >(undefined);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const { data: categoriesData } = useCategories();
  const { data: transactionsData, isLoading } = useTransactions(filters);
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const categories = categoriesData ?? [];
  const transactions = transactionsData?.data ?? [];

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => router.push("/login") });
  }

  function closeForm() {
    setEditingTransaction(undefined);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">kakeibo</h1>
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          {user && <span>{user.name}</span>}
          <Button variant="secondary" onClick={handleLogout}>
            ログアウト
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-between">
        <TransactionFilters filters={filters} onChange={setFilters} />
        <Button onClick={() => setEditingTransaction(null)}>
          収支を登録
        </Button>
      </div>

      {editingTransaction !== undefined && (
        <TransactionForm
          categories={categories}
          initialValue={editingTransaction ?? undefined}
          isSubmitting={createTransaction.isPending || updateTransaction.isPending}
          error={createTransaction.error ?? updateTransaction.error}
          onCancel={closeForm}
          onSubmit={(input) => {
            if (editingTransaction) {
              updateTransaction.mutate(
                { id: editingTransaction.id, input },
                { onSuccess: closeForm },
              );
            } else {
              createTransaction.mutate(input, { onSuccess: closeForm });
            }
          }}
        />
      )}

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            読み込み中...
          </p>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={setDeletingTransaction}
          />
        )}
      </div>

      {deletingTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <p className="text-sm text-zinc-700">
              この収支を削除しますか？この操作は取り消せません。
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeletingTransaction(null)}
              >
                キャンセル
              </Button>
              <Button
                variant="danger"
                disabled={deleteTransaction.isPending}
                onClick={() => {
                  deleteTransaction.mutate(deletingTransaction.id, {
                    onSuccess: () => setDeletingTransaction(null),
                  });
                }}
              >
                削除する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
