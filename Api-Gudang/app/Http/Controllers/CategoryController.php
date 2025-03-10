<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = category::all();

        if(!$categories){
            return response()->json([
                'status' => 'error',
                'message' => 'barang tidak ditemukan'
            ], 404);

        }
        else {
            return response()->json([
                'status' => 'success',
                'data' => $categories
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required',
            'description' => 'required'
        ]);

        $category = category::create($request->all());
        return response()->json([
            'status' => 'success',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = category::find($id);

        if(!$category){
            return response()->json([
                'status' => 'error',
                'message' => 'kategori tidak ditemukan'
            ], 404);
        }
        else {
            return response()->json([
                'status' => 'success',
                'data' => $category
            ], 200);
        }
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