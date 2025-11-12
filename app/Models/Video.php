<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'judul',
        'deskripsi',
        'file_path',
        'thumbnail_path',
        'durasi',
        'is_active',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'durasi' => 'integer',
            'urutan' => 'integer',
        ];
    }
}
