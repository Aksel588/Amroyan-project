<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'slug',
        'author',
        'category',
        'read_time',
        'meta_description',
        'meta_title',
        'keywords',
        'canonical_url',
        'featured_image',
        'tags',
        'featured',
        'published',
        'created_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
    ];

    // Accessor to convert relative image URLs to absolute URLs
    public function getFeaturedImageAttribute($value)
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_URL)) {
            $baseUrl = config('app.url', 'http://127.0.0.1:8000');
            return $baseUrl . $value;
        }
        return $value;
    }
}
