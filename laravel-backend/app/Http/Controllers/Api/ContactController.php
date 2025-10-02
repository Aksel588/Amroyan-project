<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        // Filter by read status
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        // Search by name, email, or subject
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        // Sort by created_at desc
        $query->orderBy('created_at', 'desc');

        // Pagination
        $perPage = $request->get('per_page', 10);
        $messages = $query->paginate($perPage);

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'service' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $message = ContactMessage::create($validator->validated());

        return response()->json([
            'message' => 'Contact message sent successfully',
            'data' => $message
        ], 201);
    }

    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);

        // Mark as read if not already read
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return response()->json($message);
    }

    public function update(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'subject' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'phone' => 'nullable|string|max:20',
            'service' => 'nullable|string|max:255',
            'is_read' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $message->update($validator->validated());

        return response()->json([
            'message' => 'Contact message updated successfully',
            'data' => $message
        ]);
    }

    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully'
        ]);
    }
}
