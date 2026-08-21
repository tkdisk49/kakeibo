import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Transaction } from "@/lib/types";

// バックエンドの1ページあたりの取得件数（TransactionRepository::paginateForUserのデフォルト値）と一致させる。
// 選択肢を1つだけにすることでrows per pageのセレクターは表示されなくなる
const PAGE_SIZE = 500;

// 日付ごとに分かれたテーブル同士で列幅が揃うよう、共通のcolgroupとして定義する。
// 日付は見出し（例: 21日（金））で表すため、行側には日付列を持たない
const COLUMN_WIDTHS = ["30%", "40%", "20%", "10%"];
function ColumnWidths() {
  return (
    <colgroup>
      {COLUMN_WIDTHS.map((width, index) => (
        <col key={index} style={{ width }} />
      ))}
    </colgroup>
  );
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// 収入は+、支出は-を付けて金額を表示する
function formatAmount(transaction: Transaction) {
  const amount = transaction.amount.toLocaleString("ja-JP");
  return transaction.type === "income" ? `+${amount}` : `-${amount}`;
}

// 年月は上部のセレクターで確定済みのため、日と曜日のみを表示する（例: 21日（金））
function formatDayHeading(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
  return `${day}日（${weekday}）`;
}

// 収支一覧はAPIから日付降順で返ってくるため、再ソートせず連続する同一日付をまとめるだけでグループ化できる
function groupByDate(transactions: Transaction[]) {
  const groups: { date: string; transactions: Transaction[] }[] = [];
  for (const transaction of transactions) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === transaction.date) {
      lastGroup.transactions.push(transaction);
    } else {
      groups.push({ date: transaction.date, transactions: [transaction] });
    }
  }
  return groups;
}

// 収支一覧テーブル。日付ごとにカードで区切って表示する
export function TransactionList({
  transactions,
  total,
  page,
  onPageChange,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  total: number;
  // 1始まりの現在ページ
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}) {
  if (total === 0) {
    return (
      <Card variant="outlined">
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary">
            この期間の収支データはありません。
          </Typography>
        </Box>
      </Card>
    );
  }

  const groups = groupByDate(transactions);

  return (
    <Stack spacing={1.5}>
      {/* 列見出しのみのカード。日付ごとのカードには繰り返さない */}
      <Card variant="outlined">
        <TableContainer>
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <ColumnWidths />
            <TableHead>
              <TableRow>
                <TableCell>カテゴリ</TableCell>
                <TableCell>メモ</TableCell>
                <TableCell align="right">金額</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Card>

      {groups.map((group) => (
        <Card key={group.date} variant="outlined">
          <Typography sx={{ px: 2, pt: 1.5, fontWeight: 600 }}>
            {formatDayHeading(group.date)}
          </Typography>
          <TableContainer>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <ColumnWidths />
              <TableBody>
                {group.transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Chip
                        size="small"
                        label={transaction.category?.name ?? "未分類"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {transaction.memo}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        color:
                          transaction.type === "income"
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {formatAmount(transaction)}円
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <IconButton
                          size="small"
                          aria-label="編集"
                          onClick={() => onEdit(transaction)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="削除"
                          onClick={() => onDelete(transaction)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ))}

      <Card variant="outlined">
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        />
      </Card>
    </Stack>
  );
}
