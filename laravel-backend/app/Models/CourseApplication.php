<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'message',
        'status',
        'processed_by',
        'submitted_from',
        'notes',
    ];

    protected $casts = [
        'status' => 'string',
    ];
}
