"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import type { Category, Transaction, TransactionInput, TransactionType } from "@/lib/types";

function today() {
  return new Date().toISOString().slice(0, 10);
}

// 収支の登録・編集フォーム（ダイアログ形式の共通コンポーネント）。
// initialValueがあれば編集、なければ新規登録として扱う（呼び出し側で判定）
export function TransactionForm({
  categories,
  initialValue,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: {
  categories: Category[];
  initialValue?: Transaction;
  isSubmitting: boolean;
  error?: unknown;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<TransactionType>(
    initialValue?.type ?? "expense",
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialValue?.category_id ? String(initialValue.category_id) : "",
  );
  const [amount, setAmount] = useState(
    initialValue ? String(initialValue.amount) : "",
  );
  const [date, setDate] = useState(initialValue?.date.slice(0, 10) ?? today());
  const [memo, setMemo] = useState(initialValue?.memo ?? "");

  // 選択中の収支種別（収入/支出）に対応するカテゴリのみ選択肢に出す
  const filteredCategories = categories.filter((c) => c.type === type);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      type,
      category_id: categoryId ? Number(categoryId) : null,
      amount: Number(amount),
      date,
      memo: memo || null,
    });
  }

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {initialValue ? "収支を編集" : "収支を登録"}
      </DialogTitle>
      <Stack component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2.5}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              color={type === "income" ? "success" : "error"}
              value={type}
              onChange={(_, value: TransactionType | null) => {
                if (!value) return;
                setType(value);
                setCategoryId("");
              }}
            >
              <ToggleButton value="expense">支出</ToggleButton>
              <ToggleButton value="income">収入</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              select
              label="カテゴリ"
              fullWidth
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">未分類</MenuItem>
              {filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="金額（円）"
              type="number"
              required
              fullWidth
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              label="日付"
              type="date"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <TextField
              label="メモ"
              fullWidth
              value={memo ?? ""}
              onChange={(e) => setMemo(e.target.value)}
            />

            {Boolean(error) && (
              <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
                {getErrorMessage(error)}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCancel} color="inherit">
            キャンセル
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
