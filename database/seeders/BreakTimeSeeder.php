<?php

namespace Database\Seeders;

use App\Models\BreakTime;
use Illuminate\Database\Seeder;

class BreakTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breakTimes = [
            [
                'nama' => 'Istirahat Pagi',
                'jam_mulai' => '10:00:00',
                'jam_selesai' => '10:15:00',
                'hari' => null, // Semua hari
                'is_active' => true,
                'urutan' => 1,
            ],
            [
                'nama' => 'Istirahat Siang',
                'jam_mulai' => '12:00:00',
                'jam_selesai' => '13:00:00',
                'hari' => null, // Semua hari
                'is_active' => true,
                'urutan' => 2,
            ],
            [
                'nama' => 'Istirahat Jumat (Khusus)',
                'jam_mulai' => '11:30:00',
                'jam_selesai' => '13:00:00',
                'hari' => ['Jumat'], // Hanya Jumat
                'is_active' => true,
                'urutan' => 0, // Prioritas lebih tinggi
            ],
        ];

        foreach ($breakTimes as $breakTime) {
            BreakTime::query()->updateOrCreate(
                ['nama' => $breakTime['nama']],
                $breakTime,
            );
        }
    }
}
