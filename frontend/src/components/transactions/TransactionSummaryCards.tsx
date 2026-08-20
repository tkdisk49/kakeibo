import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { TransactionSummary } from "@/lib/types";

function formatYen(amount: number) {
  return `${amount.toLocaleString("ja-JP")}円`;
}

// 1件分の集計（見出し・金額・色）を表示するカード
function SummaryCard({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color?: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color }}>
        {formatYen(amount)}
      </Typography>
    </Card>
  );
}

// 対象期間の収入・支出・差引を表示する（一覧の種別・カテゴリ絞り込みには影響されない）
export function TransactionSummaryCards({
  summary,
}: {
  summary: TransactionSummary;
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <SummaryCard label="収入" amount={summary.income} color="success.main" />
      <SummaryCard label="支出" amount={summary.expense} color="error.main" />
      <SummaryCard
        label="差引"
        amount={summary.balance}
        color={summary.balance < 0 ? "error.main" : undefined}
      />
    </Stack>
  );
}
