<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $currentDay = $now->locale('id')->isoFormat('dddd');
        $currentTime = $now->format('H:i:s');

        // Get all classes for dropdown
        $classes = \App\Models\Classes::orderBy('class')->get();

        // Get selected class from query parameter or default to first class
        $selectedClassId = request()->query('class_id');

        if (! $selectedClassId && $classes->isNotEmpty()) {
            $selectedClassId = $classes->first()->id;
        }

        // Build query with class filter (always required now)
        $query = Jadwal::with(['guru', 'mapel', 'kelas'])
            ->where('hari', $currentDay)
            ->where('class_id', $selectedClassId)
            ->orderBy('jam_mulai');

        // Ambil jadwal hari ini
        $todaySchedules = $query->get()
            ->map(function ($jadwal) use ($currentTime) {
                return [
                    'id' => $jadwal->id,
                    'mapel' => [
                        'nama_mapel' => $jadwal->mapel->nama_mapel,
                    ],
                    'guru' => [
                        'name' => $jadwal->guru->name,
                        'avatar' => $jadwal->guru->avatar ?? null,
                    ],
                    'kelas' => [
                        'name' => $jadwal->kelas->class,
                    ],
                    'jam_mulai' => Carbon::parse($jadwal->jam_mulai)->format('H:i'),
                    'jam_selesai' => Carbon::parse($jadwal->jam_selesai)->format('H:i'),
                    'is_current' => $currentTime >= $jadwal->jam_mulai && $currentTime <= $jadwal->jam_selesai,
                ];
            });

        // Jadwal yang sedang berlangsung
        $currentSchedule = $todaySchedules->firstWhere('is_current', true);

        // Jadwal selanjutnya
        $nextSchedule = Jadwal::with(['guru', 'mapel', 'kelas'])
            ->where('hari', $currentDay)
            ->where('class_id', $selectedClassId)
            ->where('jam_mulai', '>', $currentTime)
            ->orderBy('jam_mulai')
            ->first();

        return Inertia::render('Jadwal/Index', [
            'currentSchedule' => [
                'teacher' => $currentSchedule ? [
                    'id' => $currentSchedule['guru']['name'] ? 1 : null,
                    'name' => $currentSchedule['guru']['name'] ?? null,
                    'email' => 'teacher@example.com',
                    'avatar' => $currentSchedule['guru']['avatar'] ?? null,
                ] : null,
                'subject' => $currentSchedule['mapel']['nama_mapel'] ?? null,
                'startTime' => $currentSchedule['jam_mulai'] ?? null,
                'endTime' => $currentSchedule['jam_selesai'] ?? null,
            ],
            'nextSchedule' => [
                'subject' => $nextSchedule?->mapel->nama_mapel,
                'startTime' => $nextSchedule ? Carbon::parse($nextSchedule->jam_mulai)->format('H:i') : null,
                'teacherName' => $nextSchedule?->guru->name,
            ],
            'todaySchedules' => $todaySchedules,
            'currentDay' => $currentDay,
            'classes' => $classes,
            'selectedClassId' => $selectedClassId ? (int) $selectedClassId : null,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
