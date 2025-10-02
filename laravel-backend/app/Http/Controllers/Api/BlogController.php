<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Generate a unique slug for the blog post
     */
    private function generateUniqueSlug($title, $excludeId = null)
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (true) {
            $query = BlogPost::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            
            if (!$query->exists()) {
                break;
            }
            
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function index(Request $request)
    {
        $query = BlogPost::query();

        // Filter by published status
        if ($request->has('published')) {
            $query->where('published', $request->boolean('published'));
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('featured', $request->boolean('featured'));
        }

        // Search by title or content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Sort by
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $posts = $query->paginate($perPage);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        // Trim whitespace from string fields
        $data = $request->all();
        $stringFields = ['title', 'content', 'excerpt', 'author', 'category', 'read_time', 'meta_title', 'meta_description', 'keywords'];
        foreach ($stringFields as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = trim($data[$field]);
            }
        }

        $validator = Validator::make($data, [
            'title' => 'required|string|max:255|min:1',
            'content' => 'required|string|min:1',
            'excerpt' => 'required|string|min:1',
            'author' => 'required|string|max:255|min:1',
            'category' => 'required|string|max:255|min:1',
            'read_time' => 'required|string|max:50|min:1',
            'meta_description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'tags' => 'nullable|array',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['created_by'] = $request->user() ? $request->user()->id : 'anonymous';

        $post = BlogPost::create($data);

        return response()->json([
            'message' => 'Blog post created successfully',
            'data' => $post
        ], 201);
    }

    public function show($id)
    {
        $post = BlogPost::findOrFail($id);

        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'sometimes|required|string',
            'author' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:50',
            'read_time' => 'sometimes|required|string|max:50',
            'meta_description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'tags' => 'nullable|array',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        if (isset($data['title'])) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $id);
        }

        $post->update($data);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'data' => $post
        ]);
    }

    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully'
        ]);
    }
}
