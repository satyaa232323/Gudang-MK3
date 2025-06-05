<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'id_product',
        'pesan',
        'status'
    ];

    public function product()
    {
        return $this->belongsTo(related: Product::class, foreignKey: 'id_product');
    }
}