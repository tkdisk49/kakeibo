import { AxiosError } from "axios";

// Laravelのバリデーションエラー（422）等のレスポンス形式
type LaravelValidationError = {
  message: string;
  errors?: Record<string, string[]>;
};

// axiosのエラーからユーザーに表示するメッセージを取り出す
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as LaravelValidationError | undefined;
    // バリデーションエラーの場合は各項目のメッセージをまとめて表示
    if (data?.errors) {
      return Object.values(data.errors).flat().join("\n");
    }
    if (data?.message) {
      return data.message;
    }
  }

  return "エラーが発生しました。もう一度お試しください。";
}
