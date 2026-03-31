<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'role' => 'user', // Default role
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create profile
        Profile::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => 'user', // Default role
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'User registered successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Logged in successfully'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated admin's email and/or password.
     * Current password is required when the email changes or a new password is set.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (($user->role ?? '') !== 'admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $emailChanged = $request->input('email') !== $user->email;
        $passwordChange = $request->filled('password');

        $rules = [
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        if ($emailChanged || $passwordChange) {
            $rules['current_password'] = ['required', 'string'];
        }

        $validated = $request->validate($rules);

        if (! empty($validated['current_password'] ?? null)) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => [__('The current password is incorrect.')],
                ]);
            }
        }

        $user->email = $validated['email'];

        if ($passwordChange) {
            $user->password = $validated['password'];
        }

        $user->save();

        if ($user->profile) {
            $user->profile->update(['email' => $user->email]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->fresh(),
        ]);
    }
}
