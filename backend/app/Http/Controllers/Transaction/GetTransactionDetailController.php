<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionDetailRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支詳細取得コントローラー
 */
class GetTransactionDetailController extends Controller
{
    public function __invoke(GetTransactionDetailRequest $request, TransactionService $transactionService): JsonResponse
    {
        // ログインユーザー自身が所有する収支のみ取得可能（他人のIDを指定した場合は404）
        $transaction = $transactionService->getDetail(
            $request->user()->id,
            $request->validated('transaction_id'),
        );

        return response()->json($transaction);
    }
}
