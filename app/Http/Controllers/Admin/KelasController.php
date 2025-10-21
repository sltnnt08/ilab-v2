<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class KelasController extends Controller
{
    public function index(): Response
    {
        try {
            $kelas = Classes::with('defaultPic')
                ->withCount('jadwals')
                ->orderBy('class')
                ->get()
                ->map(function ($kelas) {
                    return [
                        'id' => $kelas->id,
                        'class' => $kelas->class,
                        'default_pic_name' => $kelas->defaultPic?->name,
                        'jadwals_count' => $kelas->jadwals_count,
                    ];
                });

            return Inertia::render('Admin/Kelas/Index', [
                'kelas' => $kelas,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching kelas: '.$e->getMessage());

            return Inertia::render('Admin/Kelas/Index', [
                'kelas' => [],
                'error' => 'Terjadi kesalahan saat mengambil data kelas',
            ]);
        }
    }

    public function create(): Response
    {
        $gurus = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Kelas/Create', [
            'gurus' => $gurus,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'class' => ['required', 'string', 'max:255', 'unique:classes,class'],
                'default_pic_id' => ['nullable', 'exists:users,id'],
            ], [
                'class.required' => 'Nama kelas harus diisi',
                'class.unique' => 'Kelas sudah ada',
                'class.max' => 'Nama kelas maksimal 255 karakter',
                'default_pic_id.exists' => 'Penanggung jawab tidak valid',
            ]);

            DB::beginTransaction();

            Classes::create($validated);

            DB::commit();

            return redirect()->route('admin.kelas.index')
                ->with('success', 'Kelas berhasil ditambahkan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing kelas: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat menyimpan kelas')
                ->withInput();
        }
    }

    public function edit(Classes $kelas): Response
    {
        try {
            $gurus = User::orderBy('name')->get(['id', 'name']);

            return Inertia::render('Admin/Kelas/Edit', [
                'kelas' => [
                    'id' => $kelas->id,
                    'class' => $kelas->class,
                    'default_pic_id' => $kelas->default_pic_id,
                ],
                'gurus' => $gurus,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Kelas tidak ditemukan');
        }
    }

    public function update(Request $request, Classes $kelas)
    {
        try {
            $validated = $request->validate([
                'class' => ['required', 'string', 'max:255', 'unique:classes,class,'.$kelas->id],
                'default_pic_id' => ['nullable', 'exists:users,id'],
            ], [
                'class.required' => 'Nama kelas harus diisi',
                'class.unique' => 'Kelas sudah ada',
                'class.max' => 'Nama kelas maksimal 255 karakter',
                'default_pic_id.exists' => 'Penanggung jawab tidak valid',
            ]);

            DB::beginTransaction();

            $kelas->update($validated);

            DB::commit();

            return redirect()->route('admin.kelas.index')
                ->with('success', 'Kelas berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.kelas.index')
                ->with('error', 'Kelas tidak ditemukan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating kelas: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat memperbarui kelas')
                ->withInput();
        }
    }

    public function destroy(Classes $kelas)
    {
        try {
            DB::beginTransaction();

            // Cek apakah masih ada jadwal yang menggunakan kelas ini
            if ($kelas->jadwals()->exists()) {
                return redirect()->route('admin.kelas.index')
                    ->with('error', 'Kelas tidak dapat dihapus karena masih digunakan dalam jadwal');
            }

            $kelas->delete();

            DB::commit();

            return redirect()->route('admin.kelas.index')
                ->with('success', 'Kelas berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.kelas.index')
                ->with('error', 'Kelas tidak ditemukan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting kelas: '.$e->getMessage());

            return redirect()->route('admin.kelas.index')
                ->with('error', 'Terjadi kesalahan saat menghapus kelas');
        }
    }
}
