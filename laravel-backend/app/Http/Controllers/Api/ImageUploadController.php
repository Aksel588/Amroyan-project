<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
            'folder' => 'string|max:50'
        ]);

        $file = $request->file('image');
        $folder = $request->input('folder', 'uploads');
        
        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        
        // Store the file
        $path = $file->storeAs($folder, $filename, 'public');
        
        // Return just the relative path, let the model accessor handle the full URL
        $relativePath = Storage::disk('public')->url($path);
        
        return response()->json([
            'success' => true,
            'url' => $relativePath,
            'path' => $path,
            'filename' => $filename
        ]);
    }
}
