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

export type Transaction = {
  id: number;
  user_id: number;
  category_id: number | null;
  category: Category | null;
  type: TransactionType;
  amount: string;
  date: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

export type TransactionFilters = {
  year?: number;
  month?: number;
  type?: TransactionType;
  category_id?: number;
};

export type TransactionInput = {
  type: TransactionType;
  category_id: number | null;
  amount: number;
  date: string;
  memo: string | null;
};
