<?php

namespace Database\Seeders;

use App\Models\Classes;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Database\Seeder;

class JadwalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat data user (guru) jika belum ada
        $guru1 = User::firstOrCreate(
            ['email' => 'guru1@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => bcrypt('password'),
            ]
        );

        $guru2 = User::firstOrCreate(
            ['email' => 'guru2@example.com'],
            [
                'name' => 'Siti Rahayu',
                'password' => bcrypt('password'),
            ]
        );

        $guru3 = User::firstOrCreate(
            ['email' => 'guru3@example.com'],
            [
                'name' => 'Ahmad Hidayat',
                'password' => bcrypt('password'),
            ]
        );

        // Buat data mapel
        $matematika = Mapel::firstOrCreate(['nama_mapel' => 'Matematika']);
        $bahasaIndonesia = Mapel::firstOrCreate(['nama_mapel' => 'Bahasa Indonesia']);
        $ipa = Mapel::firstOrCreate(['nama_mapel' => 'IPA']);
        $ips = Mapel::firstOrCreate(['nama_mapel' => 'IPS']);
        $bahasaInggris = Mapel::firstOrCreate(['nama_mapel' => 'Bahasa Inggris']);

        // Buat data kelas
        $kelas = Classes::firstOrCreate(['class' => 'X RPL 1']);

        // Buat jadwal untuk hari ini (Senin sebagai contoh)
        $today = now()->locale('id')->isoFormat('dddd'); // Nama hari dalam bahasa Indonesia

        // Jadwal Senin
        if ($today === 'Senin' || true) { // true untuk testing, bisa dihapus nanti
            Jadwal::create([
                'user_id' => $guru1->id,
                'mapel_id' => $matematika->id,
                'class_id' => $kelas->id,
                'hari' => 'Senin',
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ]);

            Jadwal::create([
                'user_id' => $guru2->id,
                'mapel_id' => $bahasaIndonesia->id,
                'class_id' => $kelas->id,
                'hari' => 'Senin',
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '10:00:00',
            ]);

            Jadwal::create([
                'user_id' => $guru3->id,
                'mapel_id' => $ipa->id,
                'class_id' => $kelas->id,
                'hari' => 'Senin',
                'jam_mulai' => '10:15:00',
                'jam_selesai' => '11:45:00',
            ]);

            Jadwal::create([
                'user_id' => $guru1->id,
                'mapel_id' => $ips->id,
                'class_id' => $kelas->id,
                'hari' => 'Senin',
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '14:30:00',
            ]);

            Jadwal::create([
                'user_id' => $guru2->id,
                'mapel_id' => $bahasaInggris->id,
                'class_id' => $kelas->id,
                'hari' => 'Senin',
                'jam_mulai' => '14:30:00',
                'jam_selesai' => '16:00:00',
            ]);
        }
    }
}
