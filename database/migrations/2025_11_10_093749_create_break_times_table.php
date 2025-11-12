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
        Schema::create('break_times', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Istirahat Pagi, Istirahat Siang, dll
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->json('hari')->nullable(); // ["Senin", "Selasa"] atau null = semua hari
            $table->boolean('is_active')->default(true);
            $table->integer('urutan')->default(0); // Untuk sorting
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('break_times');
    }
};
