import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Transaction } from "@/lib/types";

// バックエンドの1ページあたりの取得件数（TransactionRepository::paginateForUserのデフォルト値）と一致させる。
// 選択肢を1つだけにすることでrows per pageのセレクターは表示されなくなる
const PAGE_SIZE = 500;

// 収入は+、支出は-を付けて金額を表示する
function formatAmount(transaction: Transaction) {
  const amount = transaction.amount.toLocaleString("ja-JP");
  return transaction.type === "income" ? `+${amount}` : `-${amount}`;
}

// 年月は上部のセレクターで確定済みのため、日のみを表示する
function formatDay(date: string) {
  return `${Number(date.slice(8, 10))}日`;
}

// 収支一覧テーブル
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
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography color="text.secondary">
          この期間の収支データはありません。
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>日付</TableCell>
            <TableCell>カテゴリ</TableCell>
            <TableCell>メモ</TableCell>
            <TableCell align="right">金額</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {formatDay(transaction.date)}
              </TableCell>
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
        <TableFooter>
          <TableRow>
            <TablePagination
              count={total}
              page={page - 1}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              onPageChange={(_, newPage) => onPageChange(newPage + 1)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
