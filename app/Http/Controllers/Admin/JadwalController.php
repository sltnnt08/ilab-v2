<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJadwalRequest;
use App\Http\Requests\Admin\UpdateJadwalRequest;
use App\Models\Classes;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class JadwalController extends Controller
{
    public function index(): Response
    {
        try {
            $jadwals = Jadwal::with(['guru', 'mapel', 'kelas'])
                ->orderBy('hari')
                ->orderBy('jam_mulai')
                ->get()
                ->map(function ($jadwal) {
                    return [
                        'id' => $jadwal->id,
                        'guru_name' => $jadwal->guru->name,
                        'mapel_name' => $jadwal->mapel->nama_mapel,
                        'kelas_name' => $jadwal->kelas->class,
                        'hari' => $jadwal->hari,
                        'jam_mulai' => $jadwal->jam_mulai->format('H:i'),
                        'jam_selesai' => $jadwal->jam_selesai->format('H:i'),
                    ];
                });

            return Inertia::render('Admin/Jadwal/Index', [
                'jadwals' => $jadwals,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching jadwals: '.$e->getMessage());

            return Inertia::render('Admin/Jadwal/Index', [
                'jadwals' => [],
                'error' => 'Terjadi kesalahan saat mengambil data jadwal',
            ]);
        }
    }

    public function create(): Response|RedirectResponse
    {
        try {
            return Inertia::render('Admin/Jadwal/Create', [
                'gurus' => User::select('id', 'name')->orderBy('name')->get(),
                'mapels' => Mapel::select('id', 'nama_mapel')->orderBy('nama_mapel')->get(),
                'kelas' => Classes::select('id', 'class')->orderBy('class')->get(),
                'ruangans' => Ruangan::select('id', 'nama_ruangan')->orderBy('nama_ruangan')->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create jadwal form: '.$e->getMessage());

            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Terjadi kesalahan saat memuat form');
        }
    }

    public function store(StoreJadwalRequest $request)
    {
        try {
            DB::beginTransaction();

            // Validasi tidak ada bentrok jadwal
            $conflict = Jadwal::where('class_id', $request->class_id)
                ->where('hari', $request->hari)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('jam_mulai', [$request->jam_mulai, $request->jam_selesai])
                        ->orWhereBetween('jam_selesai', [$request->jam_mulai, $request->jam_selesai])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('jam_mulai', '<=', $request->jam_mulai)
                                ->where('jam_selesai', '>=', $request->jam_selesai);
                        });
                })
                ->exists();

            if ($conflict) {
                return back()->withErrors([
                    'jam_mulai' => 'Jadwal bentrok dengan jadwal yang sudah ada',
                ])->withInput();
            }

            Jadwal::create($request->validated());

            DB::commit();

            return redirect()->route('admin.jadwal.index')
                ->with('success', 'Jadwal berhasil ditambahkan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing jadwal: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat menyimpan jadwal')
                ->withInput();
        }
    }

    public function edit(Jadwal $jadwal): Response|RedirectResponse
    {
        try {
            return Inertia::render('Admin/Jadwal/Edit', [
                'jadwal' => [
                    'id' => $jadwal->id,
                    'user_id' => $jadwal->user_id,
                    'mapel_id' => $jadwal->mapel_id,
                    'class_id' => $jadwal->class_id,
                    'ruangan_id' => $jadwal->ruangan_id,
                    'hari' => $jadwal->hari,
                    'jam_mulai' => $jadwal->jam_mulai,
                    'jam_selesai' => $jadwal->jam_selesai,
                ],
                'gurus' => User::select('id', 'name')->orderBy('name')->get(),
                'mapels' => Mapel::select('id', 'nama_mapel')->orderBy('nama_mapel')->get(),
                'kelas' => Classes::select('id', 'class')->orderBy('class')->get(),
                'ruangans' => Ruangan::select('id', 'nama_ruangan')->orderBy('nama_ruangan')->get(),
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Jadwal tidak ditemukan');
        } catch (\Exception $e) {
            Log::error('Error loading edit jadwal form: '.$e->getMessage());

            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Terjadi kesalahan saat memuat form');
        }
    }

    public function update(UpdateJadwalRequest $request, Jadwal $jadwal)
    {
        try {
            DB::beginTransaction();

            // Validasi tidak ada bentrok jadwal (kecuali dengan dirinya sendiri)
            $conflict = Jadwal::where('class_id', $request->class_id)
                ->where('hari', $request->hari)
                ->where('id', '!=', $jadwal->id)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('jam_mulai', [$request->jam_mulai, $request->jam_selesai])
                        ->orWhereBetween('jam_selesai', [$request->jam_mulai, $request->jam_selesai])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('jam_mulai', '<=', $request->jam_mulai)
                                ->where('jam_selesai', '>=', $request->jam_selesai);
                        });
                })
                ->exists();

            if ($conflict) {
                return back()->withErrors([
                    'jam_mulai' => 'Jadwal bentrok dengan jadwal yang sudah ada',
                ])->withInput();
            }

            $jadwal->update($request->validated());

            DB::commit();

            return redirect()->route('admin.jadwal.index')
                ->with('success', 'Jadwal berhasil diperbarui');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Jadwal tidak ditemukan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating jadwal: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat memperbarui jadwal')
                ->withInput();
        }
    }

    public function destroy(Jadwal $jadwal)
    {
        try {
            DB::beginTransaction();

            $jadwal->delete();

            DB::commit();

            return redirect()->route('admin.jadwal.index')
                ->with('success', 'Jadwal berhasil dihapus');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Jadwal tidak ditemukan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting jadwal: '.$e->getMessage());

            return redirect()->route('admin.jadwal.index')
                ->with('error', 'Terjadi kesalahan saat menghapus jadwal');
        }
    }
}
