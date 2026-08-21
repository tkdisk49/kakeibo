<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionImageRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * 収支の添付画像取得コントローラー
 */
class GetTransactionImageController extends Controller
{
    public function __invoke(GetTransactionImageRequest $request, TransactionService $transactionService): StreamedResponse
    {
        // ログインユーザー自身が所有する収支の画像のみ取得可能（他人のIDや画像未添付の場合は404）
        $path = $transactionService->getImagePath(
            $request->user()->id,
            $request->validated('transaction_id'),
        );

        return Storage::disk('local')->response($path);
    }
}
