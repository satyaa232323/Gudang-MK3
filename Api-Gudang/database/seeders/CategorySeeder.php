<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'nama_kategori' => 'Elektronik',
                'description' => 'Kategori untuk produk elektronik',
            ],
            [
                'nama_kategori' => 'Pakaian',
                'description' => 'Kategori untuk produk pakaian',
            ],
            [
                'nama_kategori' => 'Makanan',
                'description' => 'Kategori untuk produk makanan',
            ],
        ];

    DB::table('categories')->insert($categories);
        // Alternatively, you can use the Category model to insert data
    }
}