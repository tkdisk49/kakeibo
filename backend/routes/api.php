<?php

use App\Http\Controllers\Auth\GetUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Category\GetCategoryListController;
use App\Http\Controllers\Transaction\CreateTransactionController;
use App\Http\Controllers\Transaction\DeleteTransactionController;
use App\Http\Controllers\Transaction\GetTransactionDetailController;
use App\Http\Controllers\Transaction\GetTransactionListController;
use App\Http\Controllers\Transaction\UpdateTransactionController;
use Illuminate\Support\Facades\Route;

// 未ログインでも呼べる認証系エンドポイント
Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

// Sanctumのセッション認証が必要なエンドポイント
// GET/POSTのみを使用し、更新・削除対象のIDはURLではなくFormRequestで受け取る方針
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/get-user', GetUserController::class);

    Route::get('/categories/get-category-list', GetCategoryListController::class);

    Route::get('/transactions/get-transaction-list', GetTransactionListController::class);
    Route::get('/transactions/get-transaction-detail', GetTransactionDetailController::class);
    Route::post('/transactions/create-transaction', CreateTransactionController::class);
    Route::post('/transactions/update-transaction', UpdateTransactionController::class);
    Route::post('/transactions/delete-transaction', DeleteTransactionController::class);
});
