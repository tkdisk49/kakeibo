<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Categoryモデルへのデータアクセスを担うRepository
 */
class CategoryRepository implements CategoryRepositoryInterface
{
    public function getOrderedList(): Collection
    {
        // 種類（income/expense）ごとにまとまるよう並び替えて取得
        return Category::orderBy('type')->orderBy('id')->get();
    }
}
