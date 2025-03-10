<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group( function () {
    
    // auth


    // endauth


    // categories 

    //  end product
    
    
    
});
Route::apiResource(name: '/categories', controller: CategoryController::class);
Route::put('/category/{id}', [CategoryResource::class, 'update']);
Route::delete('/category/{id}', [CategoryResource::class, 'destroy']);

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