<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionListRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\JsonResponse;

class GetTransactionListController extends Controller
{
    public function __invoke(GetTransactionListRequest $request, TransactionService $transactionService): JsonResponse
    {
        $transactions = $transactionService->getList($request->user()->id, $request->validated());

        return response()->json($transactions);
    }
}
