import { AxiosError } from "axios";

type LaravelValidationError = {
  message: string;
  errors?: Record<string, string[]>;
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as LaravelValidationError | undefined;
    if (data?.errors) {
      return Object.values(data.errors).flat().join("\n");
    }
    if (data?.message) {
      return data.message;
    }
  }

  return "エラーが発生しました。もう一度お試しください。";
}
