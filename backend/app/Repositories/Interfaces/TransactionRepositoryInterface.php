<?php

namespace App\Repositories\Interfaces;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Transactionモデルへのデータアクセスを抽象化するインターフェース
 */
interface TransactionRepositoryInterface
{
    // user_idでスコープした一覧をページネーション付きで取得
    public function paginateForUser(int $userId, array $filters, int $perPage = 20): LengthAwarePaginator;

    // user_idでスコープして1件取得（他人のレコードは取得できない）
    public function findForUser(int $userId, int $transactionId): ?Transaction;

    public function create(int $userId, array $data): Transaction;

    public function update(Transaction $transaction, array $data): Transaction;

    public function delete(Transaction $transaction): void;
}
