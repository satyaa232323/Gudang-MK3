<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generatePDF()
    {
        $transactions = Transaction::with('product')->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'status' => 'Tidak ada transaksi ditemukan',
                'data' => null
            ], 200);
        }

        $pdf = Pdf::loadView('report', ['transactions' => $transactions]);
        return $pdf->download('laporan_transaksi.pdf');
    }
}