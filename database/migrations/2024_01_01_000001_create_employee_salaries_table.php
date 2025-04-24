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
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')->references('employee_id')->on('employees')->onDelete('cascade');

            // Salary Amounts for all rate types
            $table->decimal('monthly_rate', 15, 2);
            $table->decimal('semi_monthly_rate', 15, 2);
            $table->decimal('daily_rate', 15, 2);
            $table->decimal('hourly_rate', 15, 2);
            $table->decimal('minute_rate', 15, 2);

            // Government Deductions
            $table->decimal('sss_contribution', 15, 2)->default(0);
            $table->decimal('philhealth_contribution', 15, 2)->default(0);
            $table->decimal('pagibig_contribution', 15, 2)->default(0);

            // Other Deductions
            $table->decimal('loan_deductions', 15, 2)->default(0);
            $table->decimal('other_deductions', 15, 2)->default(0);

            // Tax
            $table->decimal('tax_amount', 15, 2)->default(0);

            // Allowances
            $table->decimal('allowances', 15, 2)->default(0);
            $table->decimal('other_additions', 15, 2)->default(0);

            // Effective Date
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};