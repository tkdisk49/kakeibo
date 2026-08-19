<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionDetailRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

class GetTransactionDetailController extends Controller
{
    public function __invoke(GetTransactionDetailRequest $request, TransactionService $transactionService): JsonResponse
    {
        $transaction = $transactionService->getDetail(
            $request->user()->id,
            $request->validated('transaction_id'),
        );

        return response()->json($transaction);
    }
}
