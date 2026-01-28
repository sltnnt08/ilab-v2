<?php

namespace App\Http\Controllers;

use App\Models\BreakTime;
use App\Models\Jadwal;
use App\Models\Ruangan;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $currentDay = $now->locale('id')->isoFormat('dddd');
        $currentTime = $now->format('H:i:s');

        // Get all ruangans for dropdown
        $ruangans = Ruangan::orderBy('nama_ruangan')->get();

        // Get selected ruangan from query parameter or default to first ruangan
        $selectedRuanganId = request()->query('ruangan_id');

        if (! $selectedRuanganId && $ruangans->isNotEmpty()) {
            $selectedRuanganId = $ruangans->first()->id;
        }

        // Build query with ruangan filter (always required now)
        $query = Jadwal::with(['guru', 'mapel', 'kelas', 'ruangan'])
            ->where('hari', $currentDay)
            ->where('ruangan_id', $selectedRuanganId)
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
                    'is_break' => false,
                ];
            });

        // Ambil waktu istirahat yang aktif untuk hari ini
        $breakTimes = BreakTime::where('is_active', true)
            ->orderBy('urutan')
            ->get()
            ->filter(function ($breakTime) use ($currentDay) {
                // Filter break time berdasarkan hari
                if ($breakTime->hari !== null && count($breakTime->hari) > 0) {
                    return in_array($currentDay, $breakTime->hari);
                }

                // Jika hari null atau kosong, berlaku untuk semua hari
                return true;
            })
            ->map(function ($breakTime) use ($currentTime) {
                $jamMulai = is_string($breakTime->jam_mulai) ? $breakTime->jam_mulai : $breakTime->jam_mulai->format('H:i:s');
                $jamSelesai = is_string($breakTime->jam_selesai) ? $breakTime->jam_selesai : $breakTime->jam_selesai->format('H:i:s');

                return [
                    'id' => 'break_'.$breakTime->id,
                    'subject' => $breakTime->nama,
                    'teacher' => 'Waktu Istirahat',
                    'startTime' => Carbon::parse($jamMulai)->format('H:i'),
                    'endTime' => Carbon::parse($jamSelesai)->format('H:i'),
                    'is_current' => $currentTime >= $jamMulai && $currentTime <= $jamSelesai,
                    'kelas' => '-',
                    'guru_avatar' => null,
                    'is_break' => true,
                ];
            });

        // Gabungkan jadwal kelas dan istirahat, lalu urutkan berdasarkan jam mulai
        $todaySchedules = $todaySchedules->concat($breakTimes)->sortBy('startTime')->values();

        // Jadwal yang sedang berlangsung
        $currentSchedule = $todaySchedules->firstWhere('is_current', true);

        // Get selected ruangan with default PIC relationship
        $selectedRuangan = Ruangan::with('defaultPic')->find($selectedRuanganId);

        // Use teacher from current schedule, or fallback to ruangan's default PIC if no current schedule
        $currentTeacher = null;
        if ($currentSchedule) {
            $currentTeacher = [
                'id' => $currentSchedule['id'],
                'name' => $currentSchedule['teacher'],
                'email' => 'teacher@example.com',
                'avatar' => $currentSchedule['guru_avatar'] ?? null,
            ];
        } elseif ($selectedRuangan && $selectedRuangan->defaultPic) {
            $currentTeacher = [
                'id' => $selectedRuangan->defaultPic->id,
                'name' => $selectedRuangan->defaultPic->name,
                'email' => 'pic@example.com',
                'avatar' => $selectedRuangan->defaultPic->avatar ?? null,
            ];
        }

        // Jadwal selanjutnya
        $nextSchedule = Jadwal::with(['guru', 'mapel', 'kelas'])
            ->where('hari', $currentDay)
            ->where('ruangan_id', $selectedRuanganId)
            ->where('jam_mulai', '>', $currentTime)
            ->orderBy('jam_mulai')
            ->first();

        // Check if it's break time using defined break_times
        $isBreakTime = $this->checkIfBreakTime($currentDay, $currentTime);

        // Get active videos for break time
        $videos = [];
        if ($isBreakTime) {
            $videos = Video::where('is_active', true)
                ->orderBy('urutan')
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'judul' => $video->judul,
                        'deskripsi' => $video->deskripsi,
                        'file_url' => Storage::url($video->file_path),
                        'thumbnail_url' => $video->thumbnail_path ? Storage::url($video->thumbnail_path) : null,
                    ];
                });
        }

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
            'ruangans' => $ruangans,
            'selectedRuanganId' => $selectedRuanganId ? (int) $selectedRuanganId : null,
            'selectedRuangan' => $selectedRuangan ? [
                'id' => $selectedRuangan->id,
                'nama_ruangan' => $selectedRuangan->nama_ruangan,
                'keterangan' => $selectedRuangan->keterangan,
            ] : null,
            'isBreakTime' => $isBreakTime,
            'videos' => $videos,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Check if current time is within any defined break time
     */
    private function checkIfBreakTime(string $currentDay, string $currentTime): bool
    {
        $breakTimes = BreakTime::where('is_active', true)
            ->orderBy('urutan')
            ->get();

        foreach ($breakTimes as $breakTime) {
            // Check if break time applies to current day
            // If hari is null or empty, it applies to all days
            if ($breakTime->hari !== null && count($breakTime->hari) > 0) {
                if (! in_array($currentDay, $breakTime->hari)) {
                    continue;
                }
            }

            // Check if current time is within break time range
            $jamMulai = is_string($breakTime->jam_mulai) ? $breakTime->jam_mulai : $breakTime->jam_mulai->format('H:i:s');
            $jamSelesai = is_string($breakTime->jam_selesai) ? $breakTime->jam_selesai : $breakTime->jam_selesai->format('H:i:s');

            if ($currentTime >= $jamMulai && $currentTime <= $jamSelesai) {
                return true;
            }
        }

        return false;
    }
}
