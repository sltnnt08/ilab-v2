<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BreakTime;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BreakTimeController extends Controller
{
    public function index()
    {
        $breakTimes = BreakTime::orderBy('urutan')->get();

        return Inertia::render('Admin/BreakTime/Index', [
            'breakTimes' => $breakTimes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/BreakTime/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'hari' => 'nullable|array',
            'hari.*' => 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'is_active' => 'boolean',
            'urutan' => 'integer|min:1',
        ]);

        BreakTime::create($validated);

        return redirect()->route('admin.break-time.index')
            ->with('success', 'Waktu istirahat berhasil ditambahkan');
    }

    public function edit(BreakTime $breakTime)
    {
        return Inertia::render('Admin/BreakTime/Edit', [
            'breakTime' => [
                'id' => $breakTime->id,
                'nama' => $breakTime->nama,
                'jam_mulai' => substr($breakTime->jam_mulai, 0, 5), // HH:MM only
                'jam_selesai' => substr($breakTime->jam_selesai, 0, 5), // HH:MM only
                'hari' => $breakTime->hari,
                'is_active' => $breakTime->is_active,
                'urutan' => $breakTime->urutan,
            ],
        ]);
    }

    public function update(Request $request, BreakTime $breakTime)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'hari' => 'nullable|array',
            'hari.*' => 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'is_active' => 'boolean',
            'urutan' => 'integer|min:1',
        ]);

        $breakTime->update($validated);

        return redirect()->route('admin.break-time.index')
            ->with('success', 'Waktu istirahat berhasil diupdate');
    }

    public function destroy(BreakTime $breakTime)
    {
        $breakTime->delete();

        return redirect()->route('admin.break-time.index')
            ->with('success', 'Waktu istirahat berhasil dihapus');
    }
}
