<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generatePDF()
    {
        // Get products with their categories
        $products = Product::with('category')
            ->orderBy('nama_barang')
            ->get();

        // Get transactions for the last 30 days
        $transactions = Transaction::with(['product'])
            ->whereDate('tanggal', '>=', now()->subDays(30))
            ->orderBy('tanggal', 'desc')
            ->get();

        $data = [
            'date' => now()->format('d/m/Y'),
            'products' => $products,
            'transactions' => $transactions
        ];

        $pdf = PDF::loadView('reports.summary', $data);


        return $pdf->download('laporan-gudang-' . now()->format('Y-m-d') . '.pdf');
    }
}
