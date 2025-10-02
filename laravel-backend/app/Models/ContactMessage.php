<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'phone',
        'service',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];
}
