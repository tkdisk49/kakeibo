<?php

namespace App\Http\Requests\Transaction;

use App\Models\Category;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * 収支登録リクエストのバリデーション（UpdateTransactionRequestの親クラスとしても使う）
 */
class CreateTransactionRequest extends FormRequest
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
            'type' => ['required', 'in:income,expense'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'date' => ['required', 'date'],
            'memo' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $categoryId = $this->input('category_id');

            if ($categoryId === null) {
                return;
            }

            // カテゴリの種類（収入/支出）と収支の種類が食い違っていないか検証する
            $category = Category::find($categoryId);

            if ($category && $category->type !== $this->input('type')) {
                $validator->errors()->add('category_id', 'カテゴリの種類が収支の種類と一致していません。');
            }
        });
    }
}
