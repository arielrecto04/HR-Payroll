<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeSalaryController extends Controller
{
    /**
     * Display a listing of the employee salaries.
     */
    public function index(Request $request, $employeeId = null)
    {
        if ($employeeId) {
            $employee = Employee::findOrFail($employeeId);
            $salaries = $employee->salaries()->orderBy('effective_date', 'desc')->get();
            return view('employee-salaries.index', compact('employee', 'salaries'));
        } else {
            $salaries = EmployeeSalary::with('employee')
                ->orderBy('effective_date', 'desc')
                ->get();
            return view('employee-salaries.all', compact('salaries'));
        }
    }

    /**
     * Show the form for creating a new employee salary.
     */
    public function create($employeeId)
    {
        $employee = Employee::findOrFail($employeeId);
        return Inertia::render('EmployeeSalary/Create', compact('employee'));
    }

    /**
     * Store a newly created employee salary in storage.
     */
    public function store(Request $request, $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);

        $validated = $request->validate([
            'monthly_rate' => 'required|numeric|min:0',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_active' => 'boolean',
            // Other validations as needed
        ]);

        // If this is set as active, deactivate all other active salaries
        if ($request->has('is_active') && $request->is_active) {
            DB::transaction(function () use ($employeeId) {
                EmployeeSalary::where('employee_id', $employeeId)
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
            });
        }

        $validated['employee_id'] = $employeeId;

        $salary = EmployeeSalary::create($validated);

        return redirect()->route('employees.show', $employee->id)
            ->with('success', 'Employee salary created successfully.');
    }

    /**
     * Display the specified employee salary.
     */
    public function show($employeeId, $salaryId)
    {
        $employee = Employee::findOrFail($employeeId);
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->findOrFail($salaryId);

        return view('employee-salaries.show', compact('employee', 'salary'));
    }

    /**
     * Show the form for editing the specified employee salary.
     */
    public function edit($employeeId, $salaryId)
    {
        $employee = Employee::findOrFail($employeeId);
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->findOrFail($salaryId);

        return view('employee-salaries.edit', compact('employee', 'salary'));
    }

    /**
     * Update the specified employee salary in storage.
     */
    public function update(Request $request, $employeeId, $salaryId)
    {
        $employee = Employee::findOrFail($employeeId);
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->findOrFail($salaryId);

        $validated = $request->validate([
            'monthly_rate' => 'required|numeric|min:0',
            'sss_contribution' => 'nullable|numeric|min:0',
            'philhealth_contribution' => 'nullable|numeric|min:0',
            'pagibig_contribution' => 'nullable|numeric|min:0',
            'loan_deductions' => 'nullable|numeric|min:0',
            'other_deductions' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'other_additions' => 'nullable|numeric|min:0',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_active' => 'boolean',
        ]);

        // If this is set as active, deactivate all other active salaries
        if ($request->has('is_active') && $request->is_active && !$salary->is_active) {
            DB::transaction(function () use ($employeeId, $salaryId) {
                EmployeeSalary::where('employee_id', $employeeId)
                    ->where('id', '<>', $salaryId)
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
            });
        }

        $salary->update($validated);

        return redirect()->route('employee-salaries.show', [$employeeId, $salary->id])
            ->with('success', 'Employee salary updated successfully.');
    }

    /**
     * Calculate all rate types based on a given monthly rate.
     * Used for AJAX requests from the form.
     */
    public function calculateRates(Request $request)
    {
        $validated = $request->validate([
            'monthly_rate' => 'required|numeric|min:0',
        ]);

        $salary = new EmployeeSalary();
        $salary->monthly_rate = $validated['monthly_rate'];

        // Calculate all other rates
        $salary->calculateAllRates();

        return response()->json([
            'monthly_rate' => $salary->monthly_rate,
            'semi_monthly_rate' => $salary->semi_monthly_rate,
            'daily_rate' => $salary->daily_rate,
            'hourly_rate' => $salary->hourly_rate,
            'minute_rate' => $salary->minute_rate,
        ]);
    }

    /**
     * Set the specified employee salary as active.
     */
    public function activate($employeeId, $salaryId)
    {
        $employee = Employee::findOrFail($employeeId);
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->findOrFail($salaryId);

        DB::transaction(function () use ($employeeId, $salary) {
            // Deactivate all other salaries
            EmployeeSalary::where('employee_id', $employeeId)
                ->where('id', '<>', $salary->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);

            // Activate this salary
            $salary->update(['is_active' => true]);
        });

        return redirect()->route('employee-salaries.show', [$employeeId, $salary->id])
            ->with('success', 'Employee salary activated successfully.');
    }

    /**
     * Remove the specified employee salary from storage.
     */
    public function destroy($employeeId, $salaryId)
    {
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->findOrFail($salaryId);

        $salary->delete();

        return redirect()->route('employee-salaries.index', $employeeId)
            ->with('success', 'Employee salary deleted successfully.');
    }
}