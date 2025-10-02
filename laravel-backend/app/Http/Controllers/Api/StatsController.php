<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BlogPost;
use App\Models\Document;
use App\Models\ContactMessage;
use App\Models\CourseApplication;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => User::count(),
            'blog_posts' => BlogPost::count(),
            'documents' => Document::count(),
            'messages' => ContactMessage::count(),
            'course_applications' => CourseApplication::count(),
            'published_blog_posts' => BlogPost::where('published', true)->count(),
            'published_documents' => Document::where('is_published', true)->count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
            'pending_applications' => CourseApplication::where('status', 'pending')->count(),
        ];
        
        return response()->json(['data' => $stats]);
    }
}
