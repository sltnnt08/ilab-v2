<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function index(): Response
    {
        $videos = Video::orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'judul' => $video->judul,
                    'deskripsi' => $video->deskripsi,
                    'durasi' => $video->durasi,
                    'is_active' => $video->is_active,
                    'urutan' => $video->urutan,
                    'thumbnail_url' => $video->thumbnail_path ? Storage::url($video->thumbnail_path) : null,
                ];
            });

        return Inertia::render('Admin/Video/Index', [
            'videos' => $videos,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Video/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'video' => ['required', 'file', 'mimes:mp4,mov,avi,wmv', 'max:102400'], // 100MB max
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'urutan' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        // Store video file
        $videoPath = $request->file('video')->store('videos', 'public');

        // Store thumbnail if provided
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('video-thumbnails', 'public');
        }

        // Get video duration (optional - would require ffmpeg)
        $durasi = null;

        Video::create([
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'file_path' => $videoPath,
            'thumbnail_path' => $thumbnailPath,
            'durasi' => $durasi,
            'urutan' => $validated['urutan'],
            'is_active' => $validated['is_active'],
        ]);

        return redirect()->route('admin.video.index')
            ->with('success', 'Video berhasil ditambahkan');
    }

    public function edit(Video $video): Response
    {
        return Inertia::render('Admin/Video/Edit', [
            'video' => [
                'id' => $video->id,
                'judul' => $video->judul,
                'deskripsi' => $video->deskripsi,
                'durasi' => $video->durasi,
                'urutan' => $video->urutan,
                'is_active' => $video->is_active,
                'file_url' => Storage::url($video->file_path),
                'thumbnail_url' => $video->thumbnail_path ? Storage::url($video->thumbnail_path) : null,
            ],
        ]);
    }

    public function update(Request $request, Video $video): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:102400'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'urutan' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data = [
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'urutan' => $validated['urutan'],
            'is_active' => $validated['is_active'],
        ];

        // Update video file if provided
        if ($request->hasFile('video')) {
            // Delete old video
            Storage::disk('public')->delete($video->file_path);
            $data['file_path'] = $request->file('video')->store('videos', 'public');
        }

        // Update thumbnail if provided
        if ($request->hasFile('thumbnail')) {
            if ($video->thumbnail_path) {
                Storage::disk('public')->delete($video->thumbnail_path);
            }
            $data['thumbnail_path'] = $request->file('thumbnail')->store('video-thumbnails', 'public');
        }

        $video->update($data);

        return redirect()->route('admin.video.index')
            ->with('success', 'Video berhasil diupdate');
    }

    public function destroy(Video $video): RedirectResponse
    {
        // Delete files
        Storage::disk('public')->delete($video->file_path);
        if ($video->thumbnail_path) {
            Storage::disk('public')->delete($video->thumbnail_path);
        }

        $video->delete();

        return redirect()->route('admin.video.index')
            ->with('success', 'Video berhasil dihapus');
    }
}
