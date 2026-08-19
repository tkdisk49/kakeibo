<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * ログアウトコントローラー
 */
class LogoutController extends Controller
{
    public function __invoke(Request $request, AuthService $authService): Response
    {
        // 認証ガードからログアウト
        $authService->logout();

        // セッションを破棄し、CSRFトークンも再発行する
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
