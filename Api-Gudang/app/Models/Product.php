<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    protected $fillable = [
        'nama_barang',
        'stok',
        'harga',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(related: category::class);
    }

    public function transactions()
    {
        return $this->hasMany(related: transaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(related: notification::class);
    }
}