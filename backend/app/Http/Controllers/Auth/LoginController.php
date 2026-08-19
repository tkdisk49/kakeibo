<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request, AuthService $authService): JsonResponse
    {
        $user = $authService->attempt($request->validated());

        $request->session()->regenerate();

        return response()->json($user);
    }
}
