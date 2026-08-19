<?php

namespace App\Repositories\Interfaces;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TransactionRepositoryInterface
{
    public function paginateForUser(int $userId, array $filters, int $perPage = 20): LengthAwarePaginator;

    public function findForUser(int $userId, int $transactionId): ?Transaction;

    public function create(int $userId, array $data): Transaction;

    public function update(Transaction $transaction, array $data): Transaction;

    public function delete(Transaction $transaction): void;
}
