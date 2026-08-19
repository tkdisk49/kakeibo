import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { TransactionFilters as Filters, TransactionType } from "@/lib/types";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// 年・月・種別で収支一覧を絞り込むフィルターUI
export function TransactionFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const currentYear = new Date().getFullYear();
  // 直近6年分を選択肢にする
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ flexWrap: "wrap" }}
    >
      <TextField
        select
        size="small"
        label="年"
        value={filters.year}
        onChange={(e) => onChange({ ...filters, year: Number(e.target.value) })}
        sx={{ minWidth: 110 }}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}年
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="月"
        value={filters.month}
        onChange={(e) => onChange({ ...filters, month: Number(e.target.value) })}
        sx={{ minWidth: 90 }}
      >
        {MONTHS.map((month) => (
          <MenuItem key={month} value={month}>
            {month}月
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="種別"
        value={filters.type ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            type: (e.target.value || undefined) as TransactionType | undefined,
          })
        }
        sx={{ minWidth: 110 }}
      >
        <MenuItem value="">すべて</MenuItem>
        <MenuItem value="expense">支出</MenuItem>
        <MenuItem value="income">収入</MenuItem>
      </TextField>
    </Stack>
  );
}
