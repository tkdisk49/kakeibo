<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\DeleteTransactionRequest;
use App\Services\Transaction\TransactionService;
use Illuminate\Http\Response;

class DeleteTransactionController extends Controller
{
    public function __invoke(DeleteTransactionRequest $request, TransactionService $transactionService): Response
    {
        $transactionService->delete($request->user()->id, $request->validated('transaction_id'));

        return response()->noContent();
    }
}
