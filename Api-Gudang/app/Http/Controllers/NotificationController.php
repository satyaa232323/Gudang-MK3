<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\notification;
use App\Models\Notification as NotificationModel;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notifications = notification::with('product')
            ->where('status', 'unread')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $notifications
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Create a notification for low stock
     */
    public function createLowStockNotification($product)
    {
        notification::create([
            'id_product' => $product->id,
            'pesan' => "Low stock alert: {$product->name} has only {$product->stok} items remaining!",
            'status' => 'unread'
        ]);
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

    public function markAsRead($id)
    {
        $notification = NotificationModel::findOrFail($id);
        $notification->update(['status' => 'read']);

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read'
        ], 200);
    }
}