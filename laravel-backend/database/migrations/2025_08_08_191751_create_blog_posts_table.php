<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('content');
            $table->string('excerpt');
            $table->string('slug')->unique();
            $table->string('author');
            $table->string('category');
            $table->string('read_time');
            $table->text('meta_description')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(false);
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
