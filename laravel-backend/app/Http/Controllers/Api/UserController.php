<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search');
        
        $query = User::query();
        
        if ($search) {
            $query->where('email', 'like', "%{$search}%");
        }
        
        $users = $query->paginate($perPage);
        
        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['data' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'role' => 'sometimes|string|in:admin,user',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ]);
        
        $user->update($request->only(['role', 'email']));
        
        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user->fresh()
        ]);
    }

    public function count()
    {
        $count = User::count();
        return response()->json(['count' => $count]);
    }
}
