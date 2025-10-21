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
                $jamMulai = is_string($jadwal->jam_mulai) ? $jadwal->jam_mulai : $jadwal->jam_mulai->format('H:i:s');
                $jamSelesai = is_string($jadwal->jam_selesai) ? $jadwal->jam_selesai : $jadwal->jam_selesai->format('H:i:s');

                return [
                    'id' => $jadwal->id,
                    'subject' => $jadwal->mapel->nama_mapel,
                    'teacher' => $jadwal->guru->name,
                    'startTime' => Carbon::parse($jamMulai)->format('H:i'),
                    'endTime' => Carbon::parse($jamSelesai)->format('H:i'),
                    'is_current' => $currentTime >= $jamMulai && $currentTime <= $jamSelesai,
                    'kelas' => $jadwal->kelas->class,
                    'guru_avatar' => $jadwal->guru->avatar,
                ];
            });

        // Jadwal yang sedang berlangsung
        $currentSchedule = $todaySchedules->firstWhere('is_current', true);

        // Get selected class with default PIC relationship
        $selectedClass = \App\Models\Classes::with('defaultPic')->find($selectedClassId);

        // Use teacher from current schedule, or fallback to default PIC if no current schedule
        $currentTeacher = null;
        if ($currentSchedule) {
            $currentTeacher = [
                'id' => $currentSchedule['id'],
                'name' => $currentSchedule['teacher'],
                'email' => 'teacher@example.com',
                'avatar' => $currentSchedule['guru_avatar'] ?? null,
            ];
        } elseif ($selectedClass && $selectedClass->defaultPic) {
            $currentTeacher = [
                'id' => $selectedClass->defaultPic->id,
                'name' => $selectedClass->defaultPic->name,
                'email' => 'pic@example.com',
                'avatar' => $selectedClass->defaultPic->avatar ?? null,
            ];
        }

        // Jadwal selanjutnya
        $nextSchedule = Jadwal::with(['guru', 'mapel', 'kelas'])
            ->where('hari', $currentDay)
            ->where('class_id', $selectedClassId)
            ->where('jam_mulai', '>', $currentTime)
            ->orderBy('jam_mulai')
            ->first();

        return Inertia::render('Jadwal/Index', [
            'currentSchedule' => [
                'teacher' => $currentTeacher,
                'subject' => $currentSchedule['subject'] ?? null,
                'startTime' => $currentSchedule['startTime'] ?? null,
                'endTime' => $currentSchedule['endTime'] ?? null,
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
