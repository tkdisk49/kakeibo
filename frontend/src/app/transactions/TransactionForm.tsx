"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/errors";
import type { Category, Transaction, TransactionInput, TransactionType } from "@/lib/types";

function today() {
  return new Date().toISOString().slice(0, 10);
}

// 収支の登録・編集フォーム（共通コンポーネント）。
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6"
    >
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={type === "expense"}
            onChange={() => {
              setType("expense");
              setCategoryId("");
            }}
          />
          支出
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={type === "income"}
            onChange={() => {
              setType("income");
              setCategoryId("");
            }}
          />
          収入
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">カテゴリ</label>
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">未分類</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">金額（円）</label>
        <Input
          type="number"
          required
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">日付</label>
        <Input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">メモ</label>
        <Input value={memo ?? ""} onChange={(e) => setMemo(e.target.value)} />
      </div>

      {Boolean(error) && (
        <p className="whitespace-pre-line text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
