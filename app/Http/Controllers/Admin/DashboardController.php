<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalJadwal = Jadwal::count();
        $totalMapel = Mapel::count();
        $totalGuru = User::count();
        $totalKelas = Classes::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalJadwal' => $totalJadwal,
                'totalMapel' => $totalMapel,
                'totalGuru' => $totalGuru,
                'totalKelas' => $totalKelas,
            ],
        ]);
    }
}
