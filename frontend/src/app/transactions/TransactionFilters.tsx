import type { TransactionFilters as Filters, TransactionType } from "@/lib/types";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function TransactionFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        value={filters.year}
        onChange={(e) =>
          onChange({ ...filters, year: Number(e.target.value) })
        }
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}年
          </option>
        ))}
      </select>
      <select
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        value={filters.month}
        onChange={(e) =>
          onChange({ ...filters, month: Number(e.target.value) })
        }
      >
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {month}月
          </option>
        ))}
      </select>
      <select
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        value={filters.type ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            type: (e.target.value || undefined) as TransactionType | undefined,
          })
        }
      >
        <option value="">すべて</option>
        <option value="expense">支出</option>
        <option value="income">収入</option>
      </select>
    </div>
  );
}
