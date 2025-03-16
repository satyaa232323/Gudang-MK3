<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class category extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable = [
        'nama_kategori',
        'description'
    ];

    public function products()
    {
        return $this->hasMany(related: Product::class);
    }
}