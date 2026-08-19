<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ログイン中ユーザー取得コントローラー
 */
class GetUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Sanctumのセッション認証で解決されたログインユーザーを返す
        return response()->json($request->user());
    }
}
