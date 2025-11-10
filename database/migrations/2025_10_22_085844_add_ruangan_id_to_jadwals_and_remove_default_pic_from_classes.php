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
        // Add ruangan_id to jadwals table
        Schema::table('jadwals', function (Blueprint $table) {
            $table->foreignId('ruangan_id')->after('class_id')->constrained('ruangans')->onDelete('cascade');
        });

        // Remove default_pic_id from classes table (now belongs to ruangan)
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['default_pic_id']);
            $table->dropColumn('default_pic_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore default_pic_id to classes
        Schema::table('classes', function (Blueprint $table) {
            $table->foreignId('default_pic_id')->nullable()->after('class')->constrained('users')->onDelete('set null');
        });

        // Remove ruangan_id from jadwals
        Schema::table('jadwals', function (Blueprint $table) {
            $table->dropForeign(['ruangan_id']);
            $table->dropColumn('ruangan_id');
        });
    }
};
