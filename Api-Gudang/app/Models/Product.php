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
        'category_id',
        // 'min_stock'
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

    public function checkLowStock()
    {
        if ($this->stok <= $this->min_stock) {
            // Create notification
            $this->notifications()->create([
                'pesan' => "Stok {$this->nama_barang} sudah mencapai batas minimum (tersisa: {$this->stok})",
                'status' => 'unread'
            ]);
            return true;
        }
        return false;
    }
}