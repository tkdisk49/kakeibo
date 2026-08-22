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
