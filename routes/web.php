<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
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
});

require __DIR__ . '/auth.php';
