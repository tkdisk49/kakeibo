<?php

namespace App\Services\Transaction;

use App\Models\Transaction;
use App\Repositories\Interfaces\TransactionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TransactionService
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function getList(int $userId, array $filters): LengthAwarePaginator
    {
        return $this->transactionRepository->paginateForUser($userId, $filters);
    }

    public function getDetail(int $userId, int $transactionId): Transaction
    {
        return $this->findOrFail($userId, $transactionId);
    }

    public function create(int $userId, array $data): Transaction
    {
        return $this->transactionRepository->create($userId, $data);
    }

    public function update(int $userId, int $transactionId, array $data): Transaction
    {
        $transaction = $this->findOrFail($userId, $transactionId);

        return $this->transactionRepository->update($transaction, $data);
    }

    public function delete(int $userId, int $transactionId): void
    {
        $transaction = $this->findOrFail($userId, $transactionId);

        $this->transactionRepository->delete($transaction);
    }

    private function findOrFail(int $userId, int $transactionId): Transaction
    {
        $transaction = $this->transactionRepository->findForUser($userId, $transactionId);

        if (! $transaction) {
            throw new ModelNotFoundException('Transaction not found.');
        }

        return $transaction;
    }
}
