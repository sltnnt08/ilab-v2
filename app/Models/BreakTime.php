<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BreakTime extends Model
{
    protected $fillable = [
        'nama',
        'jam_mulai',
        'jam_selesai',
        'hari',
        'is_active',
        'urutan',
    ];

    protected $casts = [
        'hari' => 'array',
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];
}
