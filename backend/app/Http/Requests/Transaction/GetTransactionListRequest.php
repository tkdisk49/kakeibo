<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * 収支一覧取得リクエストのバリデーション（すべて任意の絞り込み条件）
 */
class GetTransactionListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'year' => ['nullable', 'integer'],
            'month' => ['nullable', 'integer', 'between:1,12'],
            'type' => ['nullable', 'in:income,expense'],
            'category_id' => ['nullable', 'integer'],
        ];
    }
}
