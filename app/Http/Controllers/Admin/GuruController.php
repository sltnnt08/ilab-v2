<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class GuruController extends Controller
{
    public function index(): Response
    {
        try {
            $gurus = User::withCount('jadwals')
                ->orderBy('name')
                ->get()
                ->map(function ($guru) {
                    return [
                        'id' => $guru->id,
                        'name' => $guru->name,
                        'email' => $guru->email,
                        'jadwals_count' => $guru->jadwals_count,
                    ];
                });

            return Inertia::render('Admin/Guru/Index', [
                'gurus' => $gurus,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching gurus: '.$e->getMessage());

            return Inertia::render('Admin/Guru/Index', [
                'gurus' => [],
                'error' => 'Terjadi kesalahan saat mengambil data guru',
            ]);
        }
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Guru/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ], [
                'name.required' => 'Nama harus diisi',
                'email.required' => 'Email harus diisi',
                'email.email' => 'Format email tidak valid',
                'email.unique' => 'Email sudah terdaftar',
                'password.required' => 'Password harus diisi',
                'password.min' => 'Password minimal 8 karakter',
                'password.confirmed' => 'Konfirmasi password tidak cocok',
            ]);

            DB::beginTransaction();

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            DB::commit();

            return redirect()->route('admin.guru.index')
                ->with('success', 'Guru berhasil ditambahkan');

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing guru: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat menyimpan data guru')
                ->withInput();
        }
    }

    public function edit(User $guru): Response
    {
        try {
            return Inertia::render('Admin/Guru/Edit', [
                'guru' => [
                    'id' => $guru->id,
                    'name' => $guru->name,
                    'email' => $guru->email,
                ],
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Guru tidak ditemukan');
        }
    }

    public function update(Request $request, User $guru)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$guru->id],
                'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            ], [
                'name.required' => 'Nama harus diisi',
                'email.required' => 'Email harus diisi',
                'email.email' => 'Format email tidak valid',
                'email.unique' => 'Email sudah terdaftar',
                'password.min' => 'Password minimal 8 karakter',
                'password.confirmed' => 'Konfirmasi password tidak cocok',
            ]);

            DB::beginTransaction();

            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (! empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            $guru->update($data);

            DB::commit();

            return redirect()->route('admin.guru.index')
                ->with('success', 'Guru berhasil diperbarui');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.guru.index')
                ->with('error', 'Guru tidak ditemukan');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating guru: '.$e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat memperbarui data guru')
                ->withInput();
        }
    }

    public function destroy(User $guru)
    {
        try {
            DB::beginTransaction();

            // Cek apakah masih ada jadwal yang menggunakan guru ini
            if ($guru->jadwals()->exists()) {
                return redirect()->route('admin.guru.index')
                    ->with('error', 'Guru tidak dapat dihapus karena masih memiliki jadwal mengajar');
            }

            $guru->delete();

            DB::commit();

            return redirect()->route('admin.guru.index')
                ->with('success', 'Guru berhasil dihapus');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return redirect()->route('admin.guru.index')
                ->with('error', 'Guru tidak ditemukan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting guru: '.$e->getMessage());

            return redirect()->route('admin.guru.index')
                ->with('error', 'Terjadi kesalahan saat menghapus guru');
        }
    }
}
