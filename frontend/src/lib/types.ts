export type TransactionType = "income" | "expense";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
};

// バックエンドのTransactionリソース（APIレスポンス）に対応する型
export type Transaction = {
  id: number;
  user_id: number;
  category_id: number | null;
  category: Category | null;
  type: TransactionType;
  amount: number;
  date: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

// LaravelのPaginatorレスポンス（必要なフィールドのみ抜粋）
export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

// 対象期間の収入・支出・差引（一覧の種別・カテゴリ絞り込みには影響されない）
export type TransactionSummary = {
  income: number;
  expense: number;
  balance: number;
};

// 収支一覧取得APIのレスポンス（ページネーションされた一覧 + 期間合計）
export type TransactionListResponse = PaginatedResponse<Transaction> & {
  summary: TransactionSummary;
};

// 収支一覧の絞り込み条件（すべて任意）
export type TransactionFilters = {
  year?: number;
  month?: number;
  type?: TransactionType;
  category_id?: number;
};

// 収支の登録・更新フォームの入力値
export type TransactionInput = {
  type: TransactionType;
  category_id: number | null;
  amount: number;
  date: string;
  memo: string | null;
};
