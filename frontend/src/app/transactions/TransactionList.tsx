import { Button } from "@/components/ui/Button";
import type { Transaction } from "@/lib/types";

// 収入は+、支出は-を付けて金額を表示する
function formatAmount(transaction: Transaction) {
  const amount = transaction.amount.toLocaleString("ja-JP");
  return transaction.type === "income" ? `+${amount}` : `-${amount}`;
}

// 収支一覧テーブル
export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        この期間の収支データはありません。
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-200 text-left text-zinc-500">
          <th className="py-2 font-medium">日付</th>
          <th className="py-2 font-medium">カテゴリ</th>
          <th className="py-2 font-medium">メモ</th>
          <th className="py-2 pr-2 text-right font-medium">金額</th>
          <th className="py-2 pl-4 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="border-b border-zinc-100">
            <td className="py-3 whitespace-nowrap">{transaction.date.slice(0, 10)}</td>
            <td className="py-3">{transaction.category?.name ?? "未分類"}</td>
            <td className="py-3 text-zinc-500">{transaction.memo}</td>
            <td
              className={`py-3 pr-2 text-right whitespace-nowrap font-medium ${
                transaction.type === "income" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatAmount(transaction)}円
            </td>
            <td className="py-3 pl-4 text-right whitespace-nowrap">
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => onEdit(transaction)}>
                  編集
                </Button>
                <Button variant="danger" onClick={() => onDelete(transaction)}>
                  削除
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
