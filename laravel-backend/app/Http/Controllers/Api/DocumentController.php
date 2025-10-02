<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $published = $request->get('published');
        $isPublished = $request->get('is_published');
        $category = $request->get('category');

        $query = Document::query();

        // Handle both 'published' and 'is_published' parameters for backward compatibility
        if ($published !== null) {
            $query->where('is_published', filter_var($published, FILTER_VALIDATE_BOOLEAN));
        } elseif ($isPublished !== null) {
            $query->where('is_published', filter_var($isPublished, FILTER_VALIDATE_BOOLEAN));
        }

        if ($category) {
            $query->where('category', $category);
        }

        $documents = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Convert relative URLs to absolute URLs
        $documents->getCollection()->transform(function ($document) {
            if ($document->file_url && !filter_var($document->file_url, FILTER_VALIDATE_URL)) {
                $document->file_url = 'http://127.0.0.1:8000' . $document->file_url;
            }
            return $document;
        });

        return response()->json([
            'data' => $documents->items(),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ]
        ]);
    }

    public function show($id)
    {
        $document = Document::findOrFail($id);
        
        // Convert relative URL to absolute URL
        if ($document->file_url && !filter_var($document->file_url, FILTER_VALIDATE_URL) && $document->is_published) {
            $document->file_url = 'http://127.0.0.1:8000' . $document->file_url;
        }
        
        return response()->json(['data' => $document]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|in:standards,pek_notifications,clarifications_tax,clarifications_labor,discussions,tests_accounting_finance,tests_hr',
            'file_url' => 'required|string',
            'file_name' => 'required|string',
            'mime_type' => 'required|string',
            'file_size' => 'required|integer',
        ]);

        $document = Document::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'file_url' => $request->file_url,
            'file_name' => $request->file_name,
            'mime_type' => $request->mime_type,
            'file_size' => $request->file_size,
            'uploaded_by' => auth()->id() ?? 'anonymous',
            'is_published' => false,
        ]);

        return response()->json([
            'message' => 'Document created successfully',
            'data' => $document
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'category' => 'sometimes|string|in:standards,pek_notifications,clarifications_tax,clarifications_labor,discussions,tests_accounting_finance,tests_hr',
            'is_published' => 'sometimes|boolean',
        ]);

        $document->update($request->only(['title', 'description', 'category', 'is_published']));

        return response()->json([
            'message' => 'Document updated successfully',
            'data' => $document->fresh()
        ]);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully'
        ]);
    }

    public function incrementView($id)
    {
        $document = Document::findOrFail($id);
        $document->increment('view_count');

        return response()->json([
            'message' => 'View count incremented successfully',
            'view_count' => $document->fresh()->view_count
        ]);
    }
}
