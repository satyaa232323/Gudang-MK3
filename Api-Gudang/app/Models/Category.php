<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class category extends Model
{
    protected $fillable = [
        'nama_kategori',
        'description'
    ];

    public function products()
    {
        return $this->hasMany(related: Product::class);
    }
}