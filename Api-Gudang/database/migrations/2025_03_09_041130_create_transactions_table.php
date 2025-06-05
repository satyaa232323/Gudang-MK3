<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'id_product')->constrained(table: 'products')->onDelete(action: 'cascade');
            $table->foreignId('id_user')->constrained('users');
            $table->enum('jenis_transaksi', allowed: ['masuk', 'keluar'])->default('masuk');
            $table->integer(column: 'jumlah');
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};