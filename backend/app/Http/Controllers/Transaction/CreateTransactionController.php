<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\CreateTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支登録コントローラー
 */
class CreateTransactionController extends Controller
{
    public function __invoke(CreateTransactionRequest $request, TransactionService $transactionService): JsonResponse
    {
        // ログインユーザー自身の収支として登録する
        $transaction = $transactionService->create($request->user()->id, $request->validated());

        return response()->json($transaction, 201);
    }
}
