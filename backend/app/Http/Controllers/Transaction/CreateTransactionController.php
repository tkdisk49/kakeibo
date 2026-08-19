<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\CreateTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

class CreateTransactionController extends Controller
{
    public function __invoke(CreateTransactionRequest $request, TransactionService $transactionService): JsonResponse
    {
        $transaction = $transactionService->create($request->user()->id, $request->validated());

        return response()->json($transaction, 201);
    }
}
