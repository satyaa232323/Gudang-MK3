<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    // auth
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

    Route::get('/users', [AuthenticatedSessionController::class, 'index']);

    // Report
    Route::get('/report/download', [ReportController::class, 'generatePDF']);

    // endauth


    // user
    Route::get('/user', [UserController::class, 'getAuthenticatedUser']);
    // enduser


    // product
    Route::apiResource(name: '/products', controller: ProductController::class);
    Route::put('/productUpdate/{id}', [ProductController::class, 'update']);
    Route::delete('/productDelete/{id}', [ProductController::class, 'destroy']);
    // endproduct

    //  categories
    Route::apiResource(name: '/categories', controller: CategoryController::class);
    Route::put('/categoriesUpdate/{id}', action: [CategoryController::class, 'update']);
    Route::delete('/categoriesDelete/{id}', action: [CategoryController::class, 'destroy']);
    //  end categories


    // notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);

    // categories 
    Route::apiResource(name: '/categories', controller: CategoryController::class);
    //  end categories


    // transaction
    Route::apiResource(name: '/transactions', controller: TransactionController::class);
    Route::put('/transaction/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactionDelete/{id}', action: [TransactionController::class, 'destroy']);
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
