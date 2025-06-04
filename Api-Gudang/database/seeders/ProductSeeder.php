<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'nama_barang' => 'Laptop',
                'stok' => 5,
                'harga' => 15000000,
                'category_id' => 1
            ],
            [
                'nama_barang' => 'Smartphone',
                'stok' => 20,
                'harga' => 5000000,
                'category_id' => 2
            ],
            [
                'nama_barang' => 'Tablet',
                'stok' => 15,
                'harga' => 7000000,
                'category_id' => 3
            ],
        ];

        DB::table('products')->insert($products);
    }
}