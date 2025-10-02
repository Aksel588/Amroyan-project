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
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', [
                'standards',
                'pek_notifications',
                'clarifications_tax',
                'clarifications_labor',
                'discussions',
                'tests_accounting_finance',
                'tests_hr'
            ]);
            $table->string('file_name')->nullable();
            $table->string('file_url')->nullable();
            $table->string('mime_type')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->boolean('is_published')->nullable()->default(false);
            $table->string('uploaded_by')->nullable();
            $table->integer('view_count')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
