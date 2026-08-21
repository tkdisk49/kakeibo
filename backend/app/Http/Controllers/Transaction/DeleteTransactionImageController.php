<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\DeleteTransactionImageRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支の添付画像削除コントローラー
 */
class DeleteTransactionImageController extends Controller
{
    public function __invoke(DeleteTransactionImageRequest $request, TransactionService $transactionService): JsonResponse
    {
        // ログインユーザー自身が所有する収支の画像のみ削除可能（他人のIDを指定した場合は404）
        $transaction = $transactionService->deleteImage(
            $request->user()->id,
            $request->validated('transaction_id'),
        );

        return response()->json($transaction);
    }
}
