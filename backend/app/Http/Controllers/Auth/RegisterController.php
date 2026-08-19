<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * ユーザー新規登録コントローラー
 */
class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request, AuthService $authService): JsonResponse
    {
        // ユーザーを作成し、そのままログイン状態にする
        $user = $authService->register($request->validated());

        return response()->json($user, 201);
    }
}
