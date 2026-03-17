<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Default settings used when none exist or when the settings table is missing (e.g. migration not run).
     */
    private function defaultSettings(): array
    {
        return [
            'maintenanceMode' => false,
            'allowRegistration' => true,
            'emailNotifications' => true,
            'autoBackup' => true,
            'siteName' => 'Փաստաթղթային Համակարգ',
            'adminEmail' => 'admin@example.com',
            'welcomeMessage' => 'Բարի գալուստ մեր կայք'
        ];
    }

    /**
     * Get all settings. Returns defaults with 200 if the settings table is missing so the admin page still loads.
     */
    public function index()
    {
        $defaultSettings = $this->defaultSettings();

        try {
            $settings = Setting::getAll();
            $settings = array_merge($defaultSettings, $settings);

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Throwable $e) {
            // Table missing or DB error: return defaults so admin UI loads; run migrations on server to persist settings
            return response()->json([
                'success' => true,
                'data' => $defaultSettings,
                '_fallback' => true,
                '_message' => 'Using default settings. Run: php artisan migrate'
            ]);
        }
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'maintenanceMode' => 'boolean',
                'allowRegistration' => 'boolean',
                'emailNotifications' => 'boolean',
                'autoBackup' => 'boolean',
                'siteName' => 'string|max:255',
                'adminEmail' => 'email|max:255',
                'welcomeMessage' => 'string|max:1000'
            ]);

            // Define setting types and descriptions
            $settingDefinitions = [
                'maintenanceMode' => [
                    'type' => 'boolean',
                    'description' => 'Enable maintenance mode to restrict site access'
                ],
                'allowRegistration' => [
                    'type' => 'boolean',
                    'description' => 'Allow new user registrations'
                ],
                'emailNotifications' => [
                    'type' => 'boolean',
                    'description' => 'Enable email notifications'
                ],
                'autoBackup' => [
                    'type' => 'boolean',
                    'description' => 'Enable automatic database backups'
                ],
                'siteName' => [
                    'type' => 'string',
                    'description' => 'The name of the website'
                ],
                'adminEmail' => [
                    'type' => 'string',
                    'description' => 'Primary administrator email address'
                ],
                'welcomeMessage' => [
                    'type' => 'string',
                    'description' => 'Welcome message displayed to users'
                ]
            ];

            // Save each setting
            foreach ($validatedData as $key => $value) {
                $definition = $settingDefinitions[$key] ?? ['type' => 'string', 'description' => null];
                Setting::set($key, $value, $definition['type'], $definition['description']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => Setting::getAll()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific setting
     */
    public function show($key)
    {
        try {
            $value = Setting::get($key);
            
            if ($value === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Setting not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'key' => $key,
                    'value' => $value
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initialize default settings
     */
    public function initializeDefaults()
    {
        try {
            $defaultSettings = [
                'maintenanceMode' => ['value' => false, 'type' => 'boolean', 'description' => 'Enable maintenance mode'],
                'allowRegistration' => ['value' => true, 'type' => 'boolean', 'description' => 'Allow new user registrations'],
                'emailNotifications' => ['value' => true, 'type' => 'boolean', 'description' => 'Enable email notifications'],
                'autoBackup' => ['value' => true, 'type' => 'boolean', 'description' => 'Enable automatic backups'],
                'siteName' => ['value' => 'Փաստաթղթային Համակարգ', 'type' => 'string', 'description' => 'Website name'],
                'adminEmail' => ['value' => 'admin@example.com', 'type' => 'string', 'description' => 'Administrator email'],
                'welcomeMessage' => ['value' => 'Բարի գալուստ մեր կայք', 'type' => 'string', 'description' => 'Welcome message']
            ];

            Setting::setMultiple($defaultSettings);

            return response()->json([
                'success' => true,
                'message' => 'Default settings initialized successfully',
                'data' => Setting::getAll()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize default settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set the main admin by user id. The user must have role=admin. Updates adminEmail setting to that user's email.
     */
    public function setMainAdmin(Request $request)
    {
        $request->validate([
            'user_id' => 'required_without:email|integer|exists:users,id',
            'email' => 'required_without:user_id|email|exists:users,email',
        ]);

        if ($request->has('user_id')) {
            $user = User::findOrFail($request->user_id);
        } else {
            $user = User::where('email', $request->email)->firstOrFail();
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'User must have admin role to be set as main admin'
            ], 422);
        }

        try {
            Setting::set('adminEmail', $user->email, 'string', 'Primary administrator email address');
            return response()->json([
                'success' => true,
                'message' => 'Main admin updated successfully',
                'data' => ['adminEmail' => $user->email]
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set main admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
