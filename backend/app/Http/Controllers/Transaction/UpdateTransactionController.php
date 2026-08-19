<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

class UpdateTransactionController extends Controller
{
    public function __invoke(UpdateTransactionRequest $request, TransactionService $transactionService): JsonResponse
    {
        $data = $request->validated();
        $transactionId = $data['transaction_id'];
        unset($data['transaction_id']);

        $transaction = $transactionService->update($request->user()->id, $transactionId, $data);

        return response()->json($transaction);
    }
}
