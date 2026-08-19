<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Services\Category\CategoryService;
use Illuminate\Http\JsonResponse;

/**
 * カテゴリ一覧取得コントローラー
 */
class GetCategoryListController extends Controller
{
    public function __invoke(CategoryService $categoryService): JsonResponse
    {
        // 収入・支出用に固定でseedしたカテゴリ一覧を返す
        return response()->json($categoryService->getList());
    }
}
