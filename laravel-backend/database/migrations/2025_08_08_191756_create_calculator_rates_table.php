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
        Schema::create('calculator_rates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('calculator_id');
            $table->string('label');
            $table->decimal('rate', 10, 4);
            $table->integer('sort_order')->default(0);
            $table->boolean('visible')->default(true);
            $table->timestamp('effective_from')->nullable();
            $table->timestamp('effective_to')->nullable();
            $table->timestamps();

            $table->foreign('calculator_id')->references('id')->on('calculators')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculator_rates');
    }
};
