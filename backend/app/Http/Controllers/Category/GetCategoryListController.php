<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Services\Category\CategoryService;
use Illuminate\Http\JsonResponse;

class GetCategoryListController extends Controller
{
    public function __invoke(CategoryService $categoryService): JsonResponse
    {
        return response()->json($categoryService->getList());
    }
}
