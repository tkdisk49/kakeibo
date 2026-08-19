"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin, useUser } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // すでにログイン済みの場合は一覧画面へリダイレクト
  // （proxy.ts側ではこの判定を行わないため、こちらで担う）
  useEffect(() => {
    if (user) {
      router.replace("/transactions");
    }
  }, [user, router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => router.push("/transactions") },
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">
          ログイン
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              メールアドレス
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              パスワード
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {login.isError && (
            <p className="whitespace-pre-line text-sm text-red-600">
              {getErrorMessage(login.error)}
            </p>
          )}
          <Button type="submit" disabled={login.isPending} className="mt-2">
            {login.isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="font-medium text-zinc-900 underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
