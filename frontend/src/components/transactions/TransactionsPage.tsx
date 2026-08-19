"use client";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

// 収支の一覧・登録・編集・削除を1画面で行うページ
export function TransactionsPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const logout = useLogout();

  // デフォルトは当月を表示
  const now = new Date();
  const [filters, setFilters] = useState<Filters>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  // undefined: フォーム非表示 / null: 新規登録フォーム / Transaction: 編集フォーム
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | null | undefined
  >(undefined);
  // 削除確認ダイアログの表示対象（window.confirmは使わずMUIのDialogにする方針）
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
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{ fontWeight: 700, flexGrow: 1 }}
          >
            kakeibo
          </Typography>
          {user && (
            <Typography color="text.secondary" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { sm: "center" },
            mb: 3,
          }}
        >
          <TransactionFilters filters={filters} onChange={setFilters} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditingTransaction(null)}
          >
            収支を登録
          </Button>
        </Stack>

        <Card variant="outlined">
          {isLoading ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={setDeletingTransaction}
            />
          )}
        </Card>
      </Container>

      {/* 新規登録・編集共通のフォーム。editingTransactionの有無で挙動を切り替える */}
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

      {/* 削除確認ダイアログ */}
      <Dialog
        open={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>収支の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この収支を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" onClick={() => setDeletingTransaction(null)}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteTransaction.isPending}
            onClick={() => {
              if (!deletingTransaction) return;
              deleteTransaction.mutate(deletingTransaction.id, {
                onSuccess: () => setDeletingTransaction(null),
              });
            }}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
