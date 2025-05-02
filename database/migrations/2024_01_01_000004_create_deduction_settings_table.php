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
        Schema::create('deduction_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');

            // Government Deductions
            $table->decimal('sss_contribution', 15, 2)->default(0);
            $table->decimal('philhealth_contribution', 15, 2)->default(0);
            $table->decimal('pagibig_contribution', 15, 2)->default(0);

            // Tax Settings
            $table->decimal('tax_rate', 8, 4)->default(0); // Percentage as decimal (e.g., 0.15 for 15%)
            $table->decimal('tax_exemption', 15, 2)->default(0);
            $table->string('tax_status')->default('single'); // single, married, etc.

            // Loan Deductions
            $table->json('loans')->nullable(); // Stores loan details as JSON

            // Other Regular Deductions
            $table->json('other_deductions')->nullable(); // Stores other regular deductions as JSON

            // Allowances
            $table->decimal('allowances', 15, 2)->default(0);
            $table->json('allowance_details')->nullable(); // Stores allowance breakdown as JSON

            // Other Additions
            $table->decimal('other_additions', 15, 2)->default(0);
            $table->json('addition_details')->nullable(); // Stores additional pay details as JSON

            // Effective Date
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);

            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Ensure no duplicate active settings for an employee
            $table->unique(['employee_id', 'is_active'], 'unique_active_deduction_settings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deduction_settings');
    }
};