<?php

namespace App\Http\Controllers;

use App\Models\category;
use App\Models\notification;
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
                'status' => 'data berhasil masuk',
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

        if (category::where('id', $request->category_id)->doesntExist()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori Tidak ditemukan'
            ], 404);
        }

        $product = product::create($request->all());

        // Check if stock is low and create notification if needed
        $this->checkStockAndNotify($product);

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

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_barang' => 'required',
            'stok' => 'required',
            'harga' => 'required',
            'category_id' => 'required'
        ]);

        if (category::where('id', $request->category_id)->doesntExist()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori Tidak ditemukan'
            ], 404);
        }

        $product = product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan'
            ], 404);
        }

        $product->update($request->all());

        // Check if stock is low and create notification if needed
        $this->checkStockAndNotify($product);

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

    /**
     * Check stock and create notification if necessary
     */
    private function checkStockAndNotify($product)
    {
        if ($product->stok < 8) {
            // Create notification for low stock
            notification::create([
                'id_product' => $product->id,
                'pesan' => "Stok {$product->nama_barang} hampir habis. Sisa stok: {$product->stok}",
                'status' => 'unread'
            ]);
        }
    }
}
