<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('overtime_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_id')->constrained()->onDelete('cascade');
            $table->enum('type', [
                'regular_overtime',
                'rest_day',
                'special_holiday',
                'special_holiday_rest_day',
                'legal_holiday',
                'night_differential'
            ]);
            $table->decimal('hours', 5, 2);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->decimal('rate_multiplier', 5, 2);  // Example: 1.25 for 25% premium
            $table->text('remarks')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_records');
    }
};