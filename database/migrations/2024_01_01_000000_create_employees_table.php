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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('birth_date');
            $table->string('gender');
            $table->string('civil_status');
            $table->string('nationality')->default('Filipino');
            $table->string('address');
            $table->string('contact_number');
            $table->string('email');
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_number');

            //Government IDs
            $table->string('tin_number')->nullable();
            $table->string('sss_number')->nullable();
            $table->string('philhealth_number')->nullable();
            $table->string('pagibig_number')->nullable();

            //Employment Details
            $table->date('date_hired');
            $table->string('employment_status'); // Regular, Probationary, Contractual, Part-Time, Temporary, Intern, Volunteer, Resigned, Terminated, Retired, Deceased.
            $table->string('department');
            $table->string('position');
            $table->string('status')->default('Active'); // Active, Inactive, On Leave, Terminated
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};