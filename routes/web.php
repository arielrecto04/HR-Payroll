<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeSalaryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\OvertimeRecordController;
use App\Http\Controllers\PayrollController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Employee routes
    Route::resource('employees', EmployeeController::class);

    // Employee soft delete routes
    Route::get('employees/trashed', [EmployeeController::class, 'trashed'])->name('employees.trashed');
    Route::patch('employees/{employee}/restore', [EmployeeController::class, 'restore'])->name('employees.restore');
    Route::delete('employees/{employee}/force-delete', [EmployeeController::class, 'forceDelete'])->name('employees.force-delete');

    // Employee Salary routes
    Route::get('employee-salaries', [EmployeeSalaryController::class, 'index'])->name('employee-salaries.all');
    Route::get('employees/{employee}/salaries', [EmployeeSalaryController::class, 'index'])->name('employee-salaries.index');
    Route::get('employees/{employee}/salaries/create', [EmployeeSalaryController::class, 'create'])->name('employee-salaries.create');
    Route::post('employees/{employee}/salaries', [EmployeeSalaryController::class, 'store'])->name('employee-salaries.store');
    Route::get('employees/{employee}/salaries/{salary}', [EmployeeSalaryController::class, 'show'])->name('employee-salaries.show');
    Route::get('employees/{employee}/salaries/{salary}/edit', [EmployeeSalaryController::class, 'edit'])->name('employee-salaries.edit');
    Route::put('employees/{employee}/salaries/{salary}', [EmployeeSalaryController::class, 'update'])->name('employee-salaries.update');
    Route::patch('employees/{employee}/salaries/{salary}/activate', [EmployeeSalaryController::class, 'activate'])->name('employee-salaries.activate');
    Route::delete('employees/{employee}/salaries/{salary}', [EmployeeSalaryController::class, 'destroy'])->name('employee-salaries.destroy');

    // AJAX route for calculating rates
    Route::post('employee-salaries/calculate-rates', [EmployeeSalaryController::class, 'calculateRates'])->name('employee-salaries.calculate-rates');

    // Attendance Routes
    Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('attendances/create', [AttendanceController::class, 'create'])->name('attendances.create');
    Route::post('attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('attendances/import', [AttendanceController::class, 'import'])->name('attendances.import');
    Route::post('attendances/import', [AttendanceController::class, 'processImport'])->name('attendances.processImport');
    Route::get('attendances/export', [AttendanceController::class, 'export'])->name('attendances.export');
    Route::get('attendances/{attendance}', [AttendanceController::class, 'show'])->name('attendances.show');
    Route::get('attendances/{attendance}/edit', [AttendanceController::class, 'edit'])->name('attendances.edit');
    Route::put('attendances/{attendance}', [AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('attendances/{attendance}', [AttendanceController::class, 'destroy'])->name('attendances.destroy');
    Route::patch('attendances/{attendance}/approve', [AttendanceController::class, 'approve'])->name('attendances.approve');
    Route::patch('attendances/{attendance}/reject', [AttendanceController::class, 'reject'])->name('attendances.reject');

    // Overtime Record Routes
    Route::get('overtime-records', [OvertimeRecordController::class, 'index'])->name('overtime-records.index');
    Route::get('overtime-records/create', [OvertimeRecordController::class, 'create'])->name('overtime-records.create');
    Route::post('overtime-records', [OvertimeRecordController::class, 'store'])->name('overtime-records.store');
    Route::get('overtime-records/{overtimeRecord}', [OvertimeRecordController::class, 'show'])->name('overtime-records.show');
    Route::get('overtime-records/{overtimeRecord}/edit', [OvertimeRecordController::class, 'edit'])->name('overtime-records.edit');
    Route::put('overtime-records/{overtimeRecord}', [OvertimeRecordController::class, 'update'])->name('overtime-records.update');
    Route::delete('overtime-records/{overtimeRecord}', [OvertimeRecordController::class, 'destroy'])->name('overtime-records.destroy');
    Route::patch('overtime-records/{overtimeRecord}/approve', [OvertimeRecordController::class, 'approve'])->name('overtime-records.approve');
    Route::patch('overtime-records/{overtimeRecord}/reject', [OvertimeRecordController::class, 'reject'])->name('overtime-records.reject');

    // Payroll Routes
    Route::get('payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::get('payroll/generate', [PayrollController::class, 'create'])->name('payroll.create');
    Route::post('payroll', [PayrollController::class, 'store'])->name('payroll.store');
    Route::get('payroll/{payroll}/view', [PayrollController::class, 'show'])->name('payroll.show');
    Route::get('payroll/{payroll}/edit', [PayrollController::class, 'edit'])->name('payroll.edit');
    Route::put('payroll/{payroll}', [PayrollController::class, 'update'])->name('payroll.update');
    Route::delete('payroll/{payroll}', [PayrollController::class, 'destroy'])->name('payroll.destroy');
    Route::patch('payroll/{payroll}/approve', [PayrollController::class, 'approve'])->name('payroll.approve');
    Route::patch('payroll/{payroll}/paid', [PayrollController::class, 'markAsPaid'])->name('payroll.paid');
    Route::get('payroll/{payroll}/payslips', [PayrollController::class, 'payslips'])->name('payroll.payslips');
    Route::get('payroll/{payroll}/download-pdf', [PayrollController::class, 'downloadPdf'])->name('payroll.download-pdf');
    Route::post('payroll/batch', [PayrollController::class, 'generateBatch'])->name('payroll.batch');
});

require __DIR__ . '/auth.php';
