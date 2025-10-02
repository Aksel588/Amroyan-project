<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Խնդրում ենք մուտքագրել վավեր էլ. փոստի հասցե',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;

        try {
            // Check if already subscribed
            if (Newsletter::isSubscribed($email)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Այս էլ. փոստի հասցեն արդեն բաժանորդագրված է մեր նորություններին'
                ], 409);
            }

            // Subscribe the email
            Newsletter::subscribe($email);

            return response()->json([
                'success' => true,
                'message' => 'Դուք հաջողությամբ բաժանորդագրվեցիք մեր նորություններին'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Սխալ է տեղի ունեցել: Խնդրում ենք փորձել մի փոքր ուշ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Խնդրում ենք մուտքագրել վավեր էլ. փոստի հասցե',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;

        try {
            $updated = Newsletter::unsubscribe($email);

            if ($updated) {
                return response()->json([
                    'success' => true,
                    'message' => 'Դուք հաջողությամբ ապաբաժանորդագրվեցիք մեր նորություններից'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Այս էլ. փոստի հասցեն չի գտնվել մեր նորությունների ցանկում'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Սխալ է տեղի ունեցել: Խնդրում ենք փորձել մի փոքր ուշ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get newsletter statistics (admin only)
     */
    public function stats()
    {
        try {
            $totalSubscribers = Newsletter::where('is_active', true)->count();
            $totalUnsubscribed = Newsletter::where('is_active', false)->count();
            $recentSubscribers = Newsletter::where('is_active', true)
                                          ->where('subscribed_at', '>=', now()->subDays(30))
                                          ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_subscribers' => $totalSubscribers,
                    'total_unsubscribed' => $totalUnsubscribed,
                    'recent_subscribers' => $recentSubscribers
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Չհաջողվեց բեռնել նորությունների վիճակագրությունը',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all newsletter subscribers (admin only)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 15);
            $status = $request->get('status', 'active'); // active, inactive, all

            $query = Newsletter::query();

            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }

            $subscribers = $query->orderBy('subscribed_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $subscribers->items(),
                'meta' => [
                    'current_page' => $subscribers->currentPage(),
                    'last_page' => $subscribers->lastPage(),
                    'per_page' => $subscribers->perPage(),
                    'total' => $subscribers->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Չհաջողվեց բեռնել բաժանորդների ցանկը',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}