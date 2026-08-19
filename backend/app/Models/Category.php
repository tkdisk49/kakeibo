<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 収支カテゴリ（システムで固定seedし、ユーザーによる追加編集は不可）
 */
class Category extends Model
{
    protected $fillable = ['name', 'type'];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
