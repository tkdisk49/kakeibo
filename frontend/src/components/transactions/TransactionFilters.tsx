import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
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
  const now = new Date();
  const currentYear = now.getFullYear();
  const year = filters.year ?? currentYear;
  const month = filters.month ?? now.getMonth() + 1;

  // 直近6年分を選択肢にする（矢印移動で範囲外の年になった場合も選択肢に含める）
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  if (!years.includes(year)) {
    years.push(year);
    years.sort((a, b) => b - a);
  }

  // 前月・翌月へ移動する（年をまたぐ場合も考慮）
  function stepMonth(delta: number) {
    const totalMonths = year * 12 + (month - 1) + delta;
    onChange({
      ...filters,
      year: Math.floor(totalMonths / 12),
      month: (((totalMonths % 12) + 12) % 12) + 1,
    });
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ flexWrap: "wrap", alignItems: "center" }}
    >
      <IconButton size="small" aria-label="前月へ" onClick={() => stepMonth(-1)}>
        <ChevronLeftIcon />
      </IconButton>
      <TextField
        select
        size="small"
        label="年"
        value={year}
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
        value={month}
        onChange={(e) => onChange({ ...filters, month: Number(e.target.value) })}
        sx={{ minWidth: 90 }}
      >
        {MONTHS.map((month) => (
          <MenuItem key={month} value={month}>
            {month}月
          </MenuItem>
        ))}
      </TextField>
      <IconButton size="small" aria-label="翌月へ" onClick={() => stepMonth(1)}>
        <ChevronRightIcon />
      </IconButton>
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
