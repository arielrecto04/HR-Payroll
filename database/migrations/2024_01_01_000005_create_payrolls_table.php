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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->string('payroll_period');  // e.g., "January 2024", "Jan 1-15, 2024"
            $table->date('start_date');
            $table->date('end_date');
            $table->date('payment_date');

            // Base Salary
            $table->decimal('monthly_salary', 15, 2);

            // Earnings
            $table->decimal('regular_earnings', 15, 2)->default(0);
            $table->decimal('overtime_earnings', 15, 2)->default(0);
            $table->decimal('holiday_pay', 15, 2)->default(0);
            $table->decimal('allowances', 15, 2)->default(0);
            $table->decimal('other_earnings', 15, 2)->default(0);
            $table->decimal('gross_pay', 15, 2)->default(0);

            // Deductions
            $table->decimal('sss_contribution', 15, 2)->default(0);
            $table->decimal('philhealth_contribution', 15, 2)->default(0);
            $table->decimal('pagibig_contribution', 15, 2)->default(0);
            $table->decimal('tax_withheld', 15, 2)->default(0);
            $table->decimal('loan_deductions', 15, 2)->default(0);
            $table->decimal('other_deductions', 15, 2)->default(0);
            $table->decimal('total_deductions', 15, 2)->default(0);

            // Final Pay
            $table->decimal('net_pay', 15, 2)->default(0);

            // Attendance Summary
            $table->decimal('days_worked', 5, 2)->default(0);
            $table->decimal('overtime_hours', 5, 2)->default(0);

            // JSON columns for detailed records
            $table->json('attendance_details')->nullable();
            $table->json('overtime_details')->nullable();
            $table->json('deduction_details')->nullable();
            $table->json('earning_details')->nullable();

            // Status
            $table->string('status')->default('draft'); // draft, processing, approved, paid
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Ensure no duplicate payrolls for same employee and period
            $table->unique(['employee_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};