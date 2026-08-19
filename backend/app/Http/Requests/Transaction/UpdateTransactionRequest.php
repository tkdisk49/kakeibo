<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Contracts\Validation\ValidationRule;

/**
 * 収支更新リクエストのバリデーション。
 * CreateTransactionRequestを継承し、更新対象を指定するtransaction_idのみ追加する
 */
class UpdateTransactionRequest extends CreateTransactionRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_id' => ['required', 'integer'],
            ...parent::rules(),
        ];
    }
}
