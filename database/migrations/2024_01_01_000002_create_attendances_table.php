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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->decimal('days_worked', 5, 2)->default(0);
            $table->integer('late_minutes')->default(0);
            $table->boolean('is_absent')->default(false);
            $table->text('remarks')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
            $table->softDeletes();

            // Unique constraint to prevent duplicate attendance records
            $table->unique(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};