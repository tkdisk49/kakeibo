# kakeibo

Next.js（React）+ Laravel で作る家計簿アプリ。

## 構成

- `frontend/` — Next.js (App Router, TypeScript, Tailwind CSS)
- `backend/` — Laravel (PHP 8.5, MySQL, Laravel Sail)
- `docker-compose.yml` — frontend / backend / mysql をまとめて起動する開発環境

## セットアップ（Docker）

事前に Docker Desktop を起動しておいてください。

```bash
cp backend/.env.example backend/.env   # 初回のみ
docker compose up -d --build
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- MySQL: localhost:3306 (database: `kakeibo`, user: `sail`, password: `password`)

コンテナを止める場合は `docker compose down`（DBデータも消す場合は `docker compose down -v`）。

### よく使うコマンド

```bash
docker compose logs -f              # ログを確認
docker compose exec backend bash    # backendコンテナに入る
docker compose exec backend php artisan <command>
docker compose exec frontend sh     # frontendコンテナに入る
```

## セットアップ（Dockerを使わない場合）

### backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# .env の DB_HOST を 127.0.0.1 に、DB_USERNAME/DB_PASSWORD をローカルMySQLの認証情報に変更する
php artisan migrate
php artisan serve
```

### frontend

```bash
cd frontend
npm install
npm run dev
```
