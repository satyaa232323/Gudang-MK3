<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class transaction extends Model
{
    protected $fillable = [
        'id_product',
        'id_user',
        'jenis_transaksi',
        'jumlah',
        'tanggal'
    ];

    public function product()
    {
        return $this->belongsTo(related: Product::class);
    }
}