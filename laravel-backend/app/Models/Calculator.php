<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Calculator extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'icon_name',
        'sort_order',
        'visible',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];

    public function rates(): HasMany
    {
        return $this->hasMany(CalculatorRate::class);
    }
}
