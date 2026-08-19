<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->transactions()->with('category');

        if ($request->filled('year') && $request->filled('month')) {
            $start = sprintf('%04d-%02d-01', $request->integer('year'), $request->integer('month'));
            $end = date('Y-m-t', strtotime($start));
            $query->whereBetween('date', [$start, $end]);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        return $query->orderByDesc('date')->orderByDesc('id')->paginate(20);
    }

    public function store(StoreTransactionRequest $request)
    {
        $transaction = $request->user()->transactions()->create($request->validated());

        return response()->json($transaction->load('category'), 201);
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        return $transaction->load('category');
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $transaction->update($request->validated());

        return $transaction->load('category');
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return response()->noContent();
    }
}
