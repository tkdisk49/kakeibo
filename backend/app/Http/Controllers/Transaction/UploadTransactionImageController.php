<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\UploadTransactionImageRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

/**
 * 収支への画像添付コントローラー
 */
class UploadTransactionImageController extends Controller
{
    public function __invoke(UploadTransactionImageRequest $request, TransactionService $transactionService): JsonResponse
    {
        // ログインユーザー自身が所有する収支のみ画像を添付可能（他人のIDを指定した場合は404）
        $transaction = $transactionService->uploadImage(
            $request->user()->id,
            $request->validated('transaction_id'),
            $request->file('image'),
        );

        return response()->json($transaction);
    }
}
