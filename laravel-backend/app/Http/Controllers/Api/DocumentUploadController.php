<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Document;

class DocumentUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf|max:10240', // 10MB max for PDFs
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|in:standards,pek_notifications,clarifications_tax,clarifications_labor,discussions,tests_accounting_finance,tests_hr'
        ]);

        $file = $request->file('document');
        $folder = 'documents';

        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storePubliclyAs($folder, $filename, 'public');

        // Create document record in database
        $document = Document::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'file_url' => 'http://127.0.0.1:8000' . Storage::url($path),
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => auth()->id() ?? 'anonymous',
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $document
        ]);
    }
} 