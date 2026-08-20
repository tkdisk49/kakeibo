<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Repositories\Interfaces\TransactionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Transactionモデルへのデータアクセスを担うRepository
 */
class TransactionRepository implements TransactionRepositoryInterface
{
    public function paginateForUser(int $userId, array $filters, int $perPage = 20): LengthAwarePaginator
    {
        // 常にuser_idでスコープし、他人の収支が混ざらないようにする
        $query = Transaction::query()
            ->where('user_id', $userId)
            ->with('category');

        $this->applyDateRangeFilter($query, $filters);

        // 収支種別（income/expense）で絞り込み
        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // カテゴリで絞り込み
        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        return $query->orderByDesc('date')->orderByDesc('id')->paginate($perPage);
    }

    public function summarizeForUser(int $userId, array $filters): array
    {
        // 一覧の絞り込み（種別・カテゴリ）には関係なく、対象期間全体の収入・支出を集計する
        $query = Transaction::query()->where('user_id', $userId);

        $this->applyDateRangeFilter($query, $filters);

        $totalsByType = $query
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $income = (int) ($totalsByType['income'] ?? 0);
        $expense = (int) ($totalsByType['expense'] ?? 0);

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }

    // 年月指定がある場合は日付の範囲検索にする
    // （whereYear/whereMonthは列に関数がかかりインデックスが効かなくなるため使わない）
    private function applyDateRangeFilter(Builder $query, array $filters): void
    {
        if (! empty($filters['year']) && ! empty($filters['month'])) {
            $start = sprintf('%04d-%02d-01', $filters['year'], $filters['month']);
            $end = date('Y-m-t', strtotime($start));
            $query->whereBetween('date', [$start, $end]);
        }
    }

    public function findForUser(int $userId, int $transactionId): ?Transaction
    {
        // user_idでスコープすることで、他人の収支IDを指定されても取得できないようにする
        return Transaction::query()
            ->where('user_id', $userId)
            ->with('category')
            ->find($transactionId);
    }

    public function create(int $userId, array $data): Transaction
    {
        $transaction = Transaction::create([...$data, 'user_id' => $userId]);

        return $transaction->load('category');
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);

        return $transaction->load('category');
    }

    public function delete(Transaction $transaction): void
    {
        $transaction->delete();
    }
}
