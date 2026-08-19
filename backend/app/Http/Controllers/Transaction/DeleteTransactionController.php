<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\DeleteTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\Response;

/**
 * 収支削除コントローラー
 */
class DeleteTransactionController extends Controller
{
    public function __invoke(DeleteTransactionRequest $request, TransactionService $transactionService): Response
    {
        // ログインユーザー自身が所有する収支のみ削除可能（他人のIDを指定した場合は404）
        $transactionService->delete($request->user()->id, $request->validated('transaction_id'));

        return response()->noContent();
    }
}
