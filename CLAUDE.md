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

## バックエンドのAPI設計方針

- **Controller / Service / Repository の3層構成**
  - Controller: HTTPの入出力のみを担当する薄い層
  - Service: ビジネスロジック（`app/Services/{Feature}/`）
  - Repository: データアクセスを抽象化（`app/Repositories/`、インターフェースを`app/Repositories/Interfaces/`に定義し`RepositoryServiceProvider`でDIコンテナに束縛）
  - **モデルごとに1つのRepositoryを実装する方針**（例: `TransactionRepository`, `CategoryRepository`, `UserRepository`）。今後モデルが増えたら同様にRepositoryを追加する。
- **1コントローラ1アクション**（`__invoke()`のみを持つ単一アクションコントローラ）。`index`/`store`/`show`/`update`/`destroy`を1つのコントローラにまとめる従来のリソースコントローラ（`Route::apiResource()`）は使わない。
  - 命名例: `GetTransactionListController`, `CreateTransactionController`, `UpdateTransactionController`
  - ディレクトリは機能単位（`app/Http/Controllers/{Feature}/`, `app/Http/Requests/{Feature}/`）
- **HTTPメソッドはGET/POSTのみ**。PUT/PATCH/DELETEは使わない。
  - 一覧・詳細取得はGET、作成・更新・削除はPOST
  - 更新・削除対象のIDは**URLのルートパラメータではなくFormRequestのバリデーション対象**として渡す（GETはクエリパラメータ、POSTはボディに`transaction_id`等を含める）
  - **ルートURIの末尾セグメントはコントローラー名（`Controller`を除いたケバブケース）と一致させる**（例: `GetTransactionListController` → `/get-transaction-list`）。それより前のセグメントは機能ごとに分ける名目で自由に付けてよい（例: `/transactions/get-transaction-list`）
  - ルーティング例: `GET /transactions/get-transaction-list`, `GET /transactions/get-transaction-detail`, `POST /transactions/create-transaction`, `POST /transactions/update-transaction`, `POST /transactions/delete-transaction`, `GET /get-user`
- **認可はLaravel Policyを使わず、Repository層のクエリスコープで行う**
  - 例: `TransactionRepository::findForUser(userId, transactionId)`のように、常にログインユーザーのIDでスコープしたクエリでレコードを取得する
  - 対象レコードが存在しない場合と、他人のレコードで所有権がない場合は**区別せず一律404**を返す（存在有無の情報漏洩を避けるため）
- この方針は、ルーティングの見通しの良さとIDのバリデーション一元化を重視して決定した。

## フロントエンドの構成方針

- ルートガードは`middleware.ts`ではなく**`proxy.ts`**を使う（Next.js 16で`middleware`は非推奨・`proxy`に名称変更されたため。ファイル名・エクスポート関数名ともに`proxy`）
  - `proxy.ts`はセッションクッキーの有無を見る簡易ガードに留める。クッキーはローテーションされても残ることがあるため、「クッキーあり→ログイン画面から一覧へ強制リダイレクト」のような逆方向のリダイレクトはproxy側ではやらない（ログアウト後にログイン画面へ戻れなくなるバグの原因になった）。真の認証状態はクライアント側で`/api/get-user`を叩いて判定し、401時は`useEffect`やaxiosのレスポンスインターセプターでリダイレクトする。
- ディレクトリ構成: `src/hooks/`（TanStack Queryのカスタムフック）, `src/lib/`（`api-client.ts`, `types.ts`, `errors.ts`など）, `src/components/ui/`（共通UIコンポーネント）
- **`app/{route}/page.tsx`は薄いラッパーに留め、実装は`src/components/{feature}/{Feature}Page.tsx`に切り出す**
  - `page.tsx`は`export default function Page() { return <{Feature}Page />; }`のみを持ち、状態やイベントハンドラを持たない（Server Componentのままにできる）
  - 実装本体（`"use client"`を含む）は`src/components/{feature}/{Feature}Page.tsx`に置く。命名例: `src/components/login/LoginPage.tsx`, `src/components/transactions/TransactionsPage.tsx`
  - そのページ内でのみ使う下位コンポーネントも同じ`src/components/{feature}/`配下に置く（例: `TransactionFilters.tsx`, `TransactionForm.tsx`, `TransactionList.tsx`）
- **`window.confirm`/`window.alert`などブラウザネイティブのダイアログは使わない**。アプリ内のカスタムモーダル/ダイアログコンポーネントで代替する。
  - 理由: ブラウザ自動化ツール（Claude in Chrome等）がネイティブダイアログでフリーズし、手動でのダイアログ解除が必要になった実例があるため。ユーザー体験の観点でも独自スタイルの方が望ましい。
- ライトテーマに固定する（OS/ブラウザのダークモード設定に自動追従させない）。UIコンポーネントがダークモード非対応のまま`prefers-color-scheme`の自動切り替えを残すと、背景が黒くなり視認性が崩れる不具合が起きた。

## コメント方針

- 実装時は、その処理が何を行っているか一目でわかるように**日本語のコメント**を残す
- クラス（Controller/Service/Repository等）の冒頭には、何をするクラスかを一言で示すPHPDoc（`/** ... */`）をつける
- メソッド内の主要な処理ブロックの前には、処理内容を短く要約したコメントを入れる（例: `// ログインユーザーを取得`, `// カテゴリの種類と収支の種類が一致しているか検証`）
- フロントエンドのフック・コンポーネントも同様に、何を行っているかをコメントで示す
- コメントは簡潔に。処理内容の要約に留め、自明なこと（`// idを取得` のような変数名そのままの説明）や長い説明文は避ける

## マイグレーションの規約

- **各カラムに`->comment('...')`で日本語コメントをつける**（DBeaverなどのDBクライアントでテーブル構造を見たときに内容がわかるようにするため）
  - ただし`id`（主キー）と`created_at`/`updated_at`は自明なのでコメント不要。`timestamps()`ショートカットのままでよい
- 外部キー（`foreignId()`）にコメントを付ける場合は、`->constrained()`より前に`->comment()`を呼ぶこと（`constrained()`以降は別オブジェクト（FK制約）になり、コメントがカラムに反映されない）
  ```php
  // 良い例
  $table->foreignId('user_id')->comment('登録したユーザーのID')->constrained()->cascadeOnDelete();
  // 悪い例（コメントが効かない）
  $table->foreignId('user_id')->constrained()->cascadeOnDelete()->comment('登録したユーザーのID');
  ```

## その他

- 新しいNext.js/Laravelのバージョンは訓練データと異なる挙動をしている可能性があるため、実装前に`frontend/node_modules/next/dist/docs/`や実際にインストールされたLaravelのvendorソースを確認してから進める（`proxy.ts`の件、`statefulApi()`の件はいずれもこの方法で確認済み）。
