<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'category',
        'file_name',
        'file_url',
        'mime_type',
        'file_size',
        'is_published',
        'uploaded_by',
        'view_count',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'view_count' => 'integer',
        'file_size' => 'integer',
    ];

    const CATEGORIES = [
        'standards',
        'pek_notifications',
        'clarifications_tax',
        'clarifications_labor',
        'discussions',
        'tests_accounting_finance',
        'tests_hr',
    ];
}
