<?php

use App\Http\Controllers\JadwalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Redirect root ke jadwal
Route::get('/', [JadwalController::class, 'index'])->name('home');

Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal');

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('jadwal', \App\Http\Controllers\Admin\JadwalController::class);
    Route::resource('mapel', \App\Http\Controllers\Admin\MapelController::class);
    Route::resource('guru', \App\Http\Controllers\Admin\GuruController::class);
    Route::resource('kelas', \App\Http\Controllers\Admin\KelasController::class)->parameters([
        'kelas' => 'kelas',
    ]);
    Route::resource('ruangan', \App\Http\Controllers\Admin\RuanganController::class);
});

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
