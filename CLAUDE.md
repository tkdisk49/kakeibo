# kakeibo プロジェクトルール

Next.js（React）+ Laravel で作る家計簿アプリ。このファイルはこれまでの会話で決定した規約・方針をまとめたもの。実装・提案を行う際は必ずこの内容に従うこと。

## 技術スタック

- フロントエンド: Next.js（App Router, TypeScript, React）
- UIコンポーネント: **MUI (Material UI) v9**。Tailwind CSSは廃止し、スタイリングはMUIの`sx`プロパティ・テーマ（`src/lib/theme.ts`）に統一する
  - MUI v9ではBox/Typography/Stack等に`mb`/`fontWeight`/`justifyContent`のような直接props（旧バージョンのsystem props）が使えなくなっており、必ず`sx={{ ... }}`にまとめる必要がある（Stackの`direction`/`spacing`/`divider`/`useFlexGap`のようなコンポーネント固有propsは除く）
  - App RouterでのSSR対応として`@mui/material-nextjs`の`AppRouterCacheProvider`（`src/app/providers.tsx`）を使用する
  - 将来スマホアプリ化する場合もCapacitor等でのWebViewラップを想定しており、React Native化は現状予定していない（MUIはReact Native非対応のため、方針転換時は別途検討）
- バックエンド: Laravel（PHP）, MySQL
- 開発環境: Docker Compose（frontend / backend / mysql の3コンテナ、`docker-compose.yml`はルート）
  - `frontend`サービスは`node_modules`をbind mount（`./frontend:/app`）でホストと共有しており、匿名ボリュームによる隔離は行わない。`frontend/entrypoint.sh`がコンテナ起動のたびに`npm install`を実行してから`npm run dev`するため、`package.json`さえ変更されていれば`docker compose up`（コンテナ再起動）するだけでホスト側`frontend/node_modules`にも自動的に反映される。
  - パッケージの追加・更新はホスト側で`npm install <package>`を実行してもよいし、コンテナを再起動するだけでも（entrypointが自動で`npm install`するため）反映される。どちらの方法でも同じディレクトリに書き込まれるため、明示的な同期手順（別途`npm install`し直す等）は不要。
  - 以前は`node_modules`を匿名ボリュームで隔離していたため、ホストとコンテナのnode_modulesが乖離し、ホストの`tsc`やエディタのTS Language Serverが「モジュールが見つかりません」というエラーを出す不具合が実際に発生していた（MUI導入時）。原因調査の上でこの設計に変更し、解消済み。
  - `.next`ディレクトリのみ引き続き匿名ボリューム（`/app/.next`）で隔離する（ビルドキャッシュであり同期の必要がなく、ファイル数が多くbind mountだと遅いため）。
- 認証: Laravel Sanctum の **SPAクッキー認証**（Bearerトークンは使わない）
- フロントのHTTPクライアント: **axios**（fetchではない）
  - 理由: Sanctum SPA認証はCSRFクッキー→ヘッダーの自動変換が必要で、axiosの`withCredentials`+`withXSRFToken`がこれを標準機能で賄える。fetchに寄せる場合は自前でCSRF処理を保守する必要があり、採用する定番モジュールもない。
- フロントのデータ取得/状態管理: **TanStack Query (React Query)**

## GitHub / Git運用

- 個人アカウント: https://github.com/tkdisk49 、リポジトリ: `tkdisk49/kakeibo`
- `develop`ブランチが**デフォルトブランチ**かつ日常の開発ブランチ
- `main`は**リリース専用**。`develop → main`のプルリクエストをGitHub上で作成してマージする運用
- `main`にはブランチ保護ルールを設定済み（PR必須・force push禁止・削除禁止・管理者にも適用）
- **コミットメッセージ・ドキュメント類はすべて日本語で記載する**

## コメント方針

- 実装時は、その処理が何を行っているか一目でわかるように**日本語のコメント**を残す
- クラス（Controller/Service/Repository等）の冒頭には、何をするクラスかを一言で示すPHPDoc（`/** ... */`）をつける
- メソッド内の主要な処理ブロックの前には、処理内容を短く要約したコメントを入れる（例: `// ログインユーザーを取得`, `// カテゴリの種類と収支の種類が一致しているか検証`）
- フロントエンドのフック・コンポーネントも同様に、何を行っているかをコメントで示す
- コメントは簡潔に。処理内容の要約に留め、自明なこと（`// idを取得` のような変数名そのままの説明）や長い説明文は避ける

## その他

- 新しいNext.js/Laravelのバージョンは訓練データと異なる挙動をしている可能性があるため、実装前に`frontend/node_modules/next/dist/docs/`や実際にインストールされたLaravelのvendorソースを確認してから進める（`proxy.ts`の件、`statefulApi()`の件はいずれもこの方法で確認済み）。
