<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionListRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支一覧取得コントローラー
 */
class GetTransactionListController extends Controller
{
    public function __invoke(GetTransactionListRequest $request, TransactionService $transactionService): JsonResponse
    {
        // ログインユーザー自身の収支を、年月・種別・カテゴリで絞り込んでページネーション取得
        $transactions = $transactionService->getList($request->user()->id, $request->validated());

        return response()->json($transactions);
    }
}
