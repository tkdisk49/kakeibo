<?php

namespace App\Services\Transaction;

use App\Models\Transaction;
use App\Repositories\Interfaces\TransactionRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * 収支（Transaction）に関するビジネスロジック
 */
class TransactionService
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    /**
     * ログインユーザー自身の収支一覧を取得する（年月・種別・カテゴリで絞り込み可）。
     * あわせて対象期間の収入・支出・差引の集計値と、年セレクター用の登録済み年一覧も返す
     */
    public function getList(int $userId, array $filters): array
    {
        $transactions = $this->transactionRepository->paginateForUser($userId, $filters);
        $summary = $this->transactionRepository->summarizeForUser($userId, $filters);
        $availableYears = $this->transactionRepository->getAvailableYearsForUser($userId);

        return [
            ...$transactions->toArray(),
            'summary' => $summary,
            'available_years' => $availableYears,
        ];
    }

    /**
     * ログインユーザー自身の収支を1件取得する
     */
    public function getDetail(int $userId, int $transactionId): Transaction
    {
        return $this->findOrFail($userId, $transactionId);
    }

    /**
     * 収支を新規登録する
     */
    public function create(int $userId, array $data): Transaction
    {
        return $this->transactionRepository->create($userId, $data);
    }

    /**
     * ログインユーザー自身の収支を更新する
     */
    public function update(int $userId, int $transactionId, array $data): Transaction
    {
        $transaction = $this->findOrFail($userId, $transactionId);

        return $this->transactionRepository->update($transaction, $data);
    }

    /**
     * ログインユーザー自身の収支を削除する
     */
    public function delete(int $userId, int $transactionId): void
    {
        $transaction = $this->findOrFail($userId, $transactionId);

        $this->transactionRepository->delete($transaction);
    }

    /**
     * user_idでスコープした上で収支を取得する。
     * 存在しない場合と他人の収支だった場合を区別せず404として扱う（所有権の有無を漏らさないため）
     */
    private function findOrFail(int $userId, int $transactionId): Transaction
    {
        $transaction = $this->transactionRepository->findForUser($userId, $transactionId);

        if (! $transaction) {
            throw new ModelNotFoundException('Transaction not found.');
        }

        return $transaction;
    }
}
