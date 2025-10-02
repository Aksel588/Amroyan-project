<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix malformed featured_image URLs in blog_posts table
        $posts = DB::table('blog_posts')->whereNotNull('featured_image')->get();
        
        foreach ($posts as $post) {
            if ($post->featured_image) {
                // Extract the actual filename from the malformed URL
                $url = $post->featured_image;
                
                // Look for the actual filename pattern: /storage/blog-images/filename.ext
                if (preg_match('/\/storage\/blog-images\/[^\/]+$/', $url, $matches)) {
                    $correctPath = $matches[0];
                    
                    DB::table('blog_posts')
                        ->where('id', $post->id)
                        ->update(['featured_image' => $correctPath]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration fixes data, so no rollback needed
    }
};
