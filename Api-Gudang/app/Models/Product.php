<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class product extends Model
{
    use HasApiTokens, HasFactory, Notifiable;
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