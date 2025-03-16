<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    // auth
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

    // endauth

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


    // categories 

    //  end product
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);