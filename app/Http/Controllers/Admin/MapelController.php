<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class MapelController extends Controller
{
    public function index(): Response
    {
        try {
            $mapels = Mapel::withCount('jadwals')
                ->orderBy('nama_mapel')
                ->get()
                ->map(function ($mapel) {
                    return [
                        'id' => $mapel->id,
                        'nama_mapel' => $mapel->nama_mapel,
                        'jadwals_count' => $mapel->jadwals_count,
                    ];
                });

            return Inertia::render('Admin/Mapel/Index', [
                'mapels' => $mapels,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching mapels: '.$e->getMessage());

            return Inertia::render('Admin/Mapel/Index', [
                'mapels' => [],
                'error' => 'Terjadi kesalahan saat mengambil data mata pelajaran',
            ]);
        }
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Mapel/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_mapel' => ['required', 'string', 'max:255', 'unique:mapels,nama_mapel'],
            ], [
                'nama_mapel.required' => 'Nama mata pelajaran harus diisi',
                'nama_mapel.unique' => 'Mata pelajaran sudah ada',
                'nama_mapel.max' => 'Nama mata pelajaran maksimal 255 karakter',
            ]);

            DB::beginTransaction();

            Mapel::create($validated);

            DB::commit();

            return redirect()->route('admin.mapel.index')
                ->with('success', 'Mata pelajaran berhasil ditambahkan');

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing mapel: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat menyimpan mata pelajaran')
                ->withInput();
        }
    }

    public function edit(Mapel $mapel): Response
    {
        return Inertia::render('Admin/Mapel/Edit', [
            'mapel' => [
                'id' => $mapel->id,
                'nama_mapel' => $mapel->nama_mapel,
            ],
        ]);
    }

    public function update(Request $request, Mapel $mapel)
    {
        try {
            $validated = $request->validate([
                'nama_mapel' => ['required', 'string', 'max:255', 'unique:mapels,nama_mapel,'.$mapel->id],
            ], [
                'nama_mapel.required' => 'Nama mata pelajaran harus diisi',
                'nama_mapel.unique' => 'Mata pelajaran sudah ada',
                'nama_mapel.max' => 'Nama mata pelajaran maksimal 255 karakter',
            ]);

            DB::beginTransaction();

            $mapel->update($validated);

            DB::commit();

            return redirect()->route('admin.mapel.index')
                ->with('success', 'Mata pelajaran berhasil diperbarui');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.mapel.index')
                ->with('error', 'Mata pelajaran tidak ditemukan');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating mapel: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat memperbarui mata pelajaran')
                ->withInput();
        }
    }

    public function destroy(Mapel $mapel)
    {
        try {
            DB::beginTransaction();

            // Cek apakah masih ada jadwal yang menggunakan mapel ini
            if ($mapel->jadwals()->exists()) {
                return redirect()->route('admin.mapel.index')
                    ->with('error', 'Mata pelajaran tidak dapat dihapus karena masih digunakan dalam jadwal');
            }

            $mapel->delete();

            DB::commit();

            return redirect()->route('admin.mapel.index')
                ->with('success', 'Mata pelajaran berhasil dihapus');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.mapel.index')
                ->with('error', 'Mata pelajaran tidak ditemukan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting mapel: '.$e->getMessage());

            return redirect()->route('admin.mapel.index')
                ->with('error', 'Terjadi kesalahan saat menghapus mata pelajaran');
        }
    }
}
