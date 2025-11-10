<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a user to be default PIC (or leave it null)
        $defaultPic = User::first();

        $ruangans = [
            [
                'nama_ruangan' => 'Lab Komputer 1',
                'keterangan' => 'Lab untuk praktikum pemrograman dasar',
                'default_pic_id' => $defaultPic?->id,
            ],
            [
                'nama_ruangan' => 'Lab Komputer 2',
                'keterangan' => 'Lab untuk praktikum basis data dan jaringan',
                'default_pic_id' => $defaultPic?->id,
            ],
            [
                'nama_ruangan' => 'Lab Multimedia',
                'keterangan' => 'Lab untuk praktikum desain grafis dan video editing',
                'default_pic_id' => null,
            ],
        ];

        foreach ($ruangans as $ruangan) {
            Ruangan::create($ruangan);
        }
    }
}
