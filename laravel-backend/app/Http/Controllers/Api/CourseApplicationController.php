<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseApplicationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $status = $request->get('status');
        $search = $request->get('search');
        
        $query = CourseApplication::query();
        
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        $applications = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ]
        ]);
    }

    public function show($id)
    {
        $application = CourseApplication::findOrFail($id);
        return response()->json(['data' => $application]);
    }

    public function store(Request $request)
    {
        \Log::info('Course application request received', [
            'data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string',
            'submitted_from' => 'nullable|string|max:255',
        ]);

        \Log::info('Validation passed', ['validated' => $validated]);

        $validated['status'] = 'pending';
        
        try {
            $application = CourseApplication::create($validated);
            \Log::info('Course application created successfully', ['id' => $application->id]);
            
            return response()->json([
                'data' => $application,
                'message' => 'Application submitted successfully'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Failed to create course application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to create application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $application = CourseApplication::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,approved,rejected,cancelled',
            'notes' => 'sometimes|string',
            'processed_by' => 'sometimes|string',
        ]);
        
        if (isset($validated['status'])) {
            $validated['processed_by'] = Auth::user()->name ?? 'Admin';
        }
        
        $application->update($validated);
        
        return response()->json([
            'data' => $application,
            'message' => 'Application updated successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $application = CourseApplication::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'notes' => 'nullable|string',
        ]);
        
        $validated['processed_by'] = Auth::user()->name ?? 'Admin';
        
        $application->update($validated);
        
        return response()->json([
            'data' => $application,
            'message' => 'Application status updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $application = CourseApplication::findOrFail($id);
        $application->delete();
        
        return response()->json([
            'message' => 'Application deleted successfully'
        ]);
    }

    public function count()
    {
        $pendingCount = CourseApplication::where('status', 'pending')->count();
        $approvedCount = CourseApplication::where('status', 'approved')->count();
        $rejectedCount = CourseApplication::where('status', 'rejected')->count();
        $cancelledCount = CourseApplication::where('status', 'cancelled')->count();
        $totalCount = CourseApplication::count();
        
        return response()->json([
            'pending' => $pendingCount,
            'approved' => $approvedCount,
            'rejected' => $rejectedCount,
            'cancelled' => $cancelledCount,
            'total' => $totalCount,
        ]);
    }

    public function getStats()
    {
        $monthlyStats = CourseApplication::selectRaw('
            DATE_FORMAT(created_at, "%Y-%m") as month,
            COUNT(*) as count,
            status
        ')
        ->groupBy('month', 'status')
        ->orderBy('month', 'desc')
        ->get();

        return response()->json([
            'monthly_stats' => $monthlyStats,
            'total_by_status' => $this->count()->getData(),
        ]);
    }
}
