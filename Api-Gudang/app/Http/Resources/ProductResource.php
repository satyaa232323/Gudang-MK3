<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'nama_barang' => $this->nama_barang,
            'stok' => $this->stok,
            'harga' => $this->harga,
            'category_id' => $this->category_id
        ];
    }
}