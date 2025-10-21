<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    protected $fillable = [
        'class',
        'default_pic_id',
    ];

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'class_id');
    }

    public function defaultPic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'default_pic_id');
    }
}
