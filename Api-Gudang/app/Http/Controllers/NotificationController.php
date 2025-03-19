<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = product::all();

        $productsData = $products->toArray();

        if($productsData['stok'] < 10){
           return response()->json([
               'status' => 'Stok hampir habis',
               'data' => $productsData
           ], 200);
        } else {
            return response()->json([
                'status' => 'Barang tidak ditemukan',
                'data' => $productsData
            ], 200);
        } 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}