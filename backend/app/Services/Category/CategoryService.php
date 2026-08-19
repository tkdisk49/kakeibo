<?php

namespace App\Services\Category;

use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function getList(): Collection
    {
        return $this->categoryRepository->getOrderedList();
    }
}
