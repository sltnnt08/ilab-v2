<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    protected $fillable = [
        'class',
    ];

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'class_id');
    }
}
