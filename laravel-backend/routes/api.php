<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CalculatorController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseApplicationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\DocumentUploadController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\NewsletterController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Blog routes
Route::get('/blog-posts', [BlogController::class, 'index']);
Route::get('/blog-posts/{id}', [BlogController::class, 'show']);
Route::post('/blog-posts', [BlogController::class, 'store'])->middleware('auth:sanctum');
Route::put('/blog-posts/{id}', [BlogController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/blog-posts/{id}', [BlogController::class, 'destroy'])->middleware('auth:sanctum');

// Calculator routes
Route::get('/calculators', [CalculatorController::class, 'index']);
Route::get('/calculators/{id}', [CalculatorController::class, 'show']);
Route::get('/calculators/{id}/rates', [CalculatorController::class, 'rates']);
Route::post('/calculators', [CalculatorController::class, 'store'])->middleware('auth:sanctum');
Route::put('/calculators/{id}', [CalculatorController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/calculators/{id}', [CalculatorController::class, 'destroy'])->middleware('auth:sanctum');

// Calculator rates routes
Route::post('/calculator-rates', [CalculatorController::class, 'storeRate'])->middleware('auth:sanctum');
Route::put('/calculator-rates/{id}', [CalculatorController::class, 'updateRate'])->middleware('auth:sanctum');
Route::delete('/calculator-rates/{id}', [CalculatorController::class, 'destroyRate'])->middleware('auth:sanctum');

// Contact routes
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/contact', [ContactController::class, 'index'])->middleware('auth:sanctum');
Route::get('/contact/{id}', [ContactController::class, 'show'])->middleware('auth:sanctum');
Route::put('/contact/{id}', [ContactController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/contact/{id}', [ContactController::class, 'destroy'])->middleware('auth:sanctum');

// Document routes
Route::get('/documents', [DocumentController::class, 'index']);
Route::get('/documents/{id}', [DocumentController::class, 'show']);
Route::post('/documents', [DocumentController::class, 'store'])->middleware('auth:sanctum');
Route::put('/documents/{id}', [DocumentController::class, 'update']); // Auth temporarily removed for testing
Route::delete('/documents/{id}', [DocumentController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/documents/{id}/increment-view', [DocumentController::class, 'incrementView']);
Route::post('/documents/{id}/toggle-publish', function($id) {
    $document = \App\Models\Document::findOrFail($id);
    $document->update(['is_published' => !$document->is_published]);
    return response()->json([
        'message' => 'Document publish status toggled',
        'data' => $document->fresh()
    ]);
});

// User routes
Route::get('/users', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');
Route::put('/users/{id}', [UserController::class, 'update'])->middleware('auth:sanctum');
Route::get('/users-count', [UserController::class, 'count'])->middleware('auth:sanctum');

// Course Application routes
Route::get('/course-applications', [CourseApplicationController::class, 'index'])->middleware('auth:sanctum');
Route::get('/course-applications/{id}', [CourseApplicationController::class, 'show'])->middleware('auth:sanctum');
Route::post('/course-applications', [CourseApplicationController::class, 'store']);
Route::put('/course-applications/{id}', [CourseApplicationController::class, 'update'])->middleware('auth:sanctum');
Route::patch('/course-applications/{id}/status', [CourseApplicationController::class, 'updateStatus'])->middleware('auth:sanctum');
Route::delete('/course-applications/{id}', [CourseApplicationController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/course-applications-count', [CourseApplicationController::class, 'count'])->middleware('auth:sanctum');
Route::get('/course-applications-stats', [CourseApplicationController::class, 'getStats'])->middleware('auth:sanctum');

// Stats routes
Route::get('/stats', [StatsController::class, 'index'])->middleware('auth:sanctum');

// Image upload routes
Route::post('/upload-image', [ImageUploadController::class, 'store'])->middleware('auth:sanctum');
Route::post('/upload-document', [DocumentUploadController::class, 'store']);

// Settings routes
Route::get('/settings', [SettingsController::class, 'index']);
Route::put('/settings', [SettingsController::class, 'update'])->middleware('auth:sanctum');
Route::get('/settings/{key}', [SettingsController::class, 'show']);
Route::post('/settings/initialize', [SettingsController::class, 'initializeDefaults'])->middleware('auth:sanctum');

// Newsletter routes
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
Route::get('/newsletter/stats', [NewsletterController::class, 'stats'])->middleware('auth:sanctum');
Route::get('/newsletter/subscribers', [NewsletterController::class, 'index'])->middleware('auth:sanctum'); 