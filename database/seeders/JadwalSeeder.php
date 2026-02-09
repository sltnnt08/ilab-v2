<?php

namespace Database\Seeders;

use App\Models\Classes;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\Ruangan;
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

        $ruangan = Ruangan::query()->firstOrCreate(
            ['nama_ruangan' => 'Lab Komputer 1'],
            [
                'keterangan' => 'Lab untuk praktikum pemrograman dasar',
                'default_pic_id' => $guru1->id,
            ],
        );

        $jadwals = [
            [
                'user_id' => $guru1->id,
                'mapel_id' => $matematika->id,
                'hari' => 'Senin',
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ],
            [
                'user_id' => $guru2->id,
                'mapel_id' => $bahasaIndonesia->id,
                'hari' => 'Senin',
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '10:00:00',
            ],
            [
                'user_id' => $guru3->id,
                'mapel_id' => $ipa->id,
                'hari' => 'Senin',
                'jam_mulai' => '10:15:00',
                'jam_selesai' => '11:45:00',
            ],
            [
                'user_id' => $guru1->id,
                'mapel_id' => $ips->id,
                'hari' => 'Senin',
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '14:30:00',
            ],
            [
                'user_id' => $guru2->id,
                'mapel_id' => $bahasaInggris->id,
                'hari' => 'Senin',
                'jam_mulai' => '14:30:00',
                'jam_selesai' => '16:00:00',
            ],
        ];

        foreach ($jadwals as $jadwal) {
            Jadwal::query()->updateOrCreate(
                [
                    'class_id' => $kelas->id,
                    'hari' => $jadwal['hari'],
                    'jam_mulai' => $jadwal['jam_mulai'],
                ],
                [
                    ...$jadwal,
                    'class_id' => $kelas->id,
                    'ruangan_id' => $ruangan->id,
                ],
            );
        }
    }
}
