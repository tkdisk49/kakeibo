# kakeibo

Next.js（React）+ Laravel で作る家計簿アプリ。

## 構成

- `frontend/` — Next.js (App Router, TypeScript, Tailwind CSS)
- `backend/` — Laravel (PHP 8.5, MySQL)

## セットアップ

### backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

MySQL に `kakeibo` という名前のデータベースを作成しておく必要があります。

```sql
CREATE DATABASE kakeibo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### frontend

```bash
cd frontend
npm install
npm run dev
```

http://localhost:3000 でフロントエンド、http://localhost:8000 でバックエンドAPIが起動します。
