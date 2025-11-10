<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RuanganController extends Controller
{
    public function index(): Response
    {
        try {
            $ruangans = Ruangan::with('defaultPic')
                ->withCount('jadwals')
                ->orderBy('nama_ruangan')
                ->get()
                ->map(function ($ruangan) {
                    return [
                        'id' => $ruangan->id,
                        'nama_ruangan' => $ruangan->nama_ruangan,
                        'keterangan' => $ruangan->keterangan,
                        'default_pic_name' => $ruangan->defaultPic?->name,
                        'jadwals_count' => $ruangan->jadwals_count,
                    ];
                });

            return Inertia::render('Admin/Ruangan/Index', [
                'ruangans' => $ruangans,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching ruangans: '.$e->getMessage());

            return Inertia::render('Admin/Ruangan/Index', [
                'ruangans' => [],
                'error' => 'Terjadi kesalahan saat mengambil data ruangan',
            ]);
        }
    }

    public function create(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Ruangan/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_ruangan' => ['required', 'string', 'max:255', 'unique:ruangans,nama_ruangan'],
                'keterangan' => ['nullable', 'string'],
                'default_pic_id' => ['nullable', 'exists:users,id'],
            ], [
                'nama_ruangan.required' => 'Nama ruangan harus diisi',
                'nama_ruangan.unique' => 'Ruangan sudah ada',
                'nama_ruangan.max' => 'Nama ruangan maksimal 255 karakter',
                'default_pic_id.exists' => 'Penanggung jawab tidak valid',
            ]);

            DB::beginTransaction();

            Ruangan::create($validated);

            DB::commit();

            return redirect()->route('admin.ruangan.index')
                ->with('success', 'Ruangan berhasil ditambahkan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing ruangan: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat menyimpan ruangan')
                ->withInput();
        }
    }

    public function edit(Ruangan $ruangan): Response
    {
        try {
            $users = User::orderBy('name')->get(['id', 'name']);

            return Inertia::render('Admin/Ruangan/Edit', [
                'ruangan' => [
                    'id' => $ruangan->id,
                    'nama_ruangan' => $ruangan->nama_ruangan,
                    'keterangan' => $ruangan->keterangan,
                    'default_pic_id' => $ruangan->default_pic_id,
                ],
                'users' => $users,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Ruangan tidak ditemukan');
        }
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        try {
            $validated = $request->validate([
                'nama_ruangan' => ['required', 'string', 'max:255', 'unique:ruangans,nama_ruangan,'.$ruangan->id],
                'keterangan' => ['nullable', 'string'],
                'default_pic_id' => ['nullable', 'exists:users,id'],
            ], [
                'nama_ruangan.required' => 'Nama ruangan harus diisi',
                'nama_ruangan.unique' => 'Ruangan sudah ada',
                'nama_ruangan.max' => 'Nama ruangan maksimal 255 karakter',
                'default_pic_id.exists' => 'Penanggung jawab tidak valid',
            ]);

            DB::beginTransaction();

            $ruangan->update($validated);

            DB::commit();

            return redirect()->route('admin.ruangan.index')
                ->with('success', 'Ruangan berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.ruangan.index')
                ->with('error', 'Ruangan tidak ditemukan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating ruangan: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat memperbarui ruangan')
                ->withInput();
        }
    }

    public function destroy(Ruangan $ruangan)
    {
        try {
            DB::beginTransaction();

            // Cek apakah masih ada jadwal yang menggunakan ruangan ini
            if ($ruangan->jadwals()->exists()) {
                return redirect()->route('admin.ruangan.index')
                    ->with('error', 'Ruangan tidak dapat dihapus karena masih digunakan dalam jadwal');
            }

            $ruangan->delete();

            DB::commit();

            return redirect()->route('admin.ruangan.index')
                ->with('success', 'Ruangan berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.ruangan.index')
                ->with('error', 'Ruangan tidak ditemukan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting ruangan: '.$e->getMessage());

            return redirect()->route('admin.ruangan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus ruangan');
        }
    }
}
