<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支更新コントローラー
 */
class UpdateTransactionController extends Controller
{
    public function __invoke(UpdateTransactionRequest $request, TransactionService $transactionService): JsonResponse
    {
        // 更新対象のIDと更新内容を分離する（transaction_idはリクエストボディに含まれる）
        $data = $request->validated();
        $transactionId = $data['transaction_id'];
        unset($data['transaction_id']);

        // ログインユーザー自身が所有する収支のみ更新可能（他人のIDを指定した場合は404）
        $transaction = $transactionService->update($request->user()->id, $transactionId, $data);

        return response()->json($transaction);
    }
}
