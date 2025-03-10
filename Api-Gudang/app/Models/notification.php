<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class notification extends Model
{
    protected $fillable = [
        'id_product',
        'pesan',
        'status'
    ];

    public function product()
    {
        return $this->belongsTo(related: Product::class);
    }
    
}