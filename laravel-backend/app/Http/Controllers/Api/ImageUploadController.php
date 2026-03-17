<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
        
        $baseUrl = rtrim($request->getSchemeAndHttpHost(), '/');
        // Use API route for blog-images so it works without public/storage symlink
        $url = $folder === 'blog-images'
            ? $baseUrl . '/api/blog-images/' . $filename
            : $baseUrl . '/storage/' . ltrim($path, '/');
        
        return response()->json([
            'success' => true,
            'url' => $url,
            'path' => $path,
            'filename' => $filename
        ]);
    }

    /**
     * Serve a blog image from storage. Use this so /storage/ symlink is not required on production.
     */
    public function serveBlogImage(string $filename): StreamedResponse|\Illuminate\Http\Response
    {
        $path = 'blog-images/' . $filename;
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }
        $mime = match (strtolower(pathinfo($filename, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            default => 'application/octet-stream',
        };
        return response()->stream(
            function () use ($path) {
                $stream = Storage::disk('public')->readStream($path);
                if ($stream) {
                    fpassthru($stream);
                    fclose($stream);
                }
            },
            200,
            [
                'Content-Type' => $mime,
                'Cache-Control' => 'public, max-age=31536000',
            ]
        );
    }
}
