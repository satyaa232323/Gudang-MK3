<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = product::all();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => 'Barang tidak ditemukan',
                'data' => null
            ], 200);
        } else {
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required',
            'stok' => 'required',
            'harga' => 'required',
            'category_id' => 'required'
        ]);

        $product = product::create($request->all());
        return response()->json([
            'status' => 'barang berhasil ditambahkan',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = product::find($id);

        if ($product->isEmpty()) {
            return response()->json(data: [
                'status' => 'error',
                'message' => 'Product not found'
            ], status: 404);
        } else {
            return response()->json([
                'status' => 'success',
                'data' => $product
            ], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama_barang' => 'required',
            'stok' => 'required',
            'harga' => 'required',
            'category_id' => 'required'
        ]);

        $product = product::find($id);
        $product->update($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        
        $product = product::findOrFail($id);
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        } else {
            $product->delete();
            return response()->json([
                'status' => 'barang berhasil dihapus',
            ], 200);
        }
    }
}