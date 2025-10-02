<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        try {
            $settings = Setting::getAll();
            
            // Provide default values if no settings exist
            $defaultSettings = [
                'maintenanceMode' => false,
                'allowRegistration' => true,
                'emailNotifications' => true,
                'autoBackup' => true,
                'siteName' => 'Փաստաթղթային Համակարգ',
                'adminEmail' => 'admin@example.com',
                'welcomeMessage' => 'Բարի գալուստ մեր կայք'
            ];

            // Merge with defaults
            $settings = array_merge($defaultSettings, $settings);

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
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
}
