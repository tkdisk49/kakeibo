"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRegister, useUser } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

export default function RegisterPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // すでにログイン済みの場合は一覧画面へリダイレクト
  useEffect(() => {
    if (user) {
      router.replace("/transactions");
    }
  }, [user, router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    register.mutate(
      {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
      { onSuccess: () => router.push("/transactions") },
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">
          新規登録
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              名前
            </label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              パスワード（確認）
            </label>
            <Input
              type="password"
              required
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          {register.isError && (
            <p className="whitespace-pre-line text-sm text-red-600">
              {getErrorMessage(register.error)}
            </p>
          )}
          <Button
            type="submit"
            disabled={register.isPending}
            className="mt-2"
          >
            {register.isPending ? "登録中..." : "登録する"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
