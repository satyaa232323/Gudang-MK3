<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use app\Models\notification;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::with('product')->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'status' => 'Tidak ada transaksi ditemukan',
                'data' => null
            ], 200);
        } else {
            return response()->json([
                'status' => 'Data transaksi berhasil diambil',
                'data' => $transactions
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_product' => 'required|exists:products,id',
            'jenis_transaksi' => 'required|string|in:masuk,keluar',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
        ]);

        $product = Product::findOrFail($request->id_product);

        // Check if there's enough stock for outgoing transactions
        if ($request->jenis_transaksi === 'keluar') {
            if ($product->stok < $request->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stok tidak mencukupi'
                ], 400);
            }
            $product->stok -= $request->jumlah;
        } else if ($request->jenis_transaksi === 'masuk') {
            $product->stok += $request->jumlah;
        }

        $product->save();

        // Check if stock is low after transaction
        $this->checkStockAndNotify($product);

        $transaction = Transaction::create($request->all());

        return response()->json([
            'status' => 'Transaksi berhasil dibuat',
            'data' => $transaction
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with('product')->find($id);

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $oldTransaction = $transaction->replicate();

        $request->validate([
            'id_product' => 'sometimes|required|exists:products,id',
            'id_user' => 'sometimes|required|exists:users,id',
            'jenis_transaksi' => 'sometimes|required|string|in:masuk,keluar',
            'jumlah' => 'sometimes|required|integer|min:1',
            'tanggal' => 'sometimes|required|date',
        ]);

        // If updating product or transaction type or amount, we need to handle stock
        if ($request->has('id_product') || $request->has('jenis_transaksi') || $request->has('jumlah')) {
            $product = Product::findOrFail($request->id_product ?? $transaction->id_product);

            // Reverse the effect of the old transaction
            if ($oldTransaction->jenis_transaksi === 'keluar') {
                $product->stok += $oldTransaction->jumlah;
            } else {
                $product->stok -= $oldTransaction->jumlah;
            }

            // Apply the new transaction
            $newJenisTransaksi = $request->jenis_transaksi ?? $transaction->jenis_transaksi;
            $newJumlah = $request->jumlah ?? $transaction->jumlah;

            if ($newJenisTransaksi === 'keluar') {
                if ($product->stok < $newJumlah) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Stok tidak mencukupi'
                    ], 400);
                }
                $product->stok -= $newJumlah;
            } else {
                $product->stok += $newJumlah;
            }

            $product->save();

            // Check if stock is low after update
            $this->checkStockAndNotify($product);
        }

        $transaction->update($request->all());
        return response()->json([
            'status' => 'Transaksi berhasil diperbarui',
            'data' => $transaction
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return response()->json([
            'status' => 'Transaksi berhasil dihapus',
            'data' => null
        ], 204);
    }

    /**
     * Check stock and create notification if necessary
     */
    private function checkStockAndNotify($product)
    {
        if ($product->stok < 8) {
            Notification::create([
                'id_product' => $product->id,
                'pesan' => "Stok {$product->nama_barang} hampir habis. Sisa stok: {$product->stok}",
                'status' => 'unread'
            ]);
        }
    }
}
