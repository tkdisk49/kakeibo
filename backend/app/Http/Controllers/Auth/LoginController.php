<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * ログインコントローラー
 */
class LoginController extends Controller
{
    public function __invoke(LoginRequest $request, AuthService $authService): JsonResponse
    {
        // メール・パスワードを検証してログイン
        $user = $authService->attempt($request->validated());

        // セッションIDを再発行し、セッション固定攻撃を防ぐ
        $request->session()->regenerate();

        return response()->json($user);
    }
}
