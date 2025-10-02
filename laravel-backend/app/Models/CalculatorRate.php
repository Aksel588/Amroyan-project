<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalculatorRate extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'calculator_id',
        'label',
        'rate',
        'sort_order',
        'visible',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'rate' => 'decimal:4',
        'visible' => 'boolean',
        'effective_from' => 'datetime',
        'effective_to' => 'datetime',
    ];

    public function calculator(): BelongsTo
    {
        return $this->belongsTo(Calculator::class);
    }
}
