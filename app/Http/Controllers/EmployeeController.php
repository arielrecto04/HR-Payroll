<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index()
    {
        $employees = Employee::orderBy('last_name')->get();
        return Inertia::render('Employee/Index', ['employees' => $employees]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        return Inertia::render('Employee/Create');
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedEmployee = $request->validate([
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'suffix' => 'nullable|string|max:50',
                'birth_date' => 'required|date',
                'gender' => 'required|string',
                'civil_status' => 'required|string',
                'nationality' => 'required|string|max:255',
                'address' => 'required|string',
                'contact_number' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_number' => 'required|string|max:20',
                'tin_number' => 'nullable|string|max:50',
                'sss_number' => 'nullable|string|max:50',
                'philhealth_number' => 'nullable|string|max:50',
                'pagibig_number' => 'nullable|string|max:50',
                'date_hired' => 'required|date',
                'employment_status' => 'required|string',
                'department' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'status' => 'required|string|in:Active,Inactive,On Leave,Terminated',
                'basic_salary' => 'nullable|numeric|min:0',
                'salary_type' => 'nullable|string|in:Monthly,Semi-Monthly,Weekly,Daily,Hourly',
            ]);

            // Auto-generate employee_id with format IITS00XX
            $latestEmployee = Employee::orderBy('id', 'desc')->first();
            $nextId = 1;

            if ($latestEmployee) {
                $lastEmployeeId = $latestEmployee->employee_id;
                // Check if the last ID follows the format
                if (preg_match('/^IITS00(\d+)$/', $lastEmployeeId, $matches)) {
                    $nextId = intval($matches[1]) + 1;
                }
            }

            $validatedEmployee['employee_id'] = 'IITS00' . $nextId;

            // Extract salary fields from validated data
            $salaryData = [
                'basic_salary' => $validatedEmployee['basic_salary'] ?? null,
                'salary_type' => $validatedEmployee['salary_type'] ?? 'Monthly',
            ];

            // Remove salary fields from employee data
            unset($validatedEmployee['basic_salary']);
            unset($validatedEmployee['salary_type']);

            // Create employee record
            $employee = new Employee();
            $employee->fill($validatedEmployee);
            $employee->save();

            // If salary information was provided, create a salary record
            if (!empty($salaryData['basic_salary'])) {
                $newSalary = [
                    'employee_id' => $employee->id,
                    'effective_date' => $validatedEmployee['date_hired'],
                    'is_active' => true,
                    'hourly_rate' => 0,
                    'daily_rate' => 0,
                    'semi_monthly_rate' => 0,
                    'monthly_rate' => 0,
                    'minute_rate' => 0,
                ];

                // Set the appropriate rate based on salary_type
                switch ($salaryData['salary_type']) {
                    case 'Monthly':
                        $newSalary['monthly_rate'] = $salaryData['basic_salary'];
                        break;
                    case 'Semi-Monthly':
                        $newSalary['semi_monthly_rate'] = $salaryData['basic_salary'];
                        $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 2;
                        break;
                    case 'Weekly':
                        $newSalary['daily_rate'] = $salaryData['basic_salary'] / 5; // Assuming 5-day work week
                        $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 4.33; // Average weeks in a month
                        break;
                    case 'Daily':
                        $newSalary['daily_rate'] = $salaryData['basic_salary'];
                        $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 22; // Assuming 22 working days
                        break;
                    case 'Hourly':
                        $newSalary['hourly_rate'] = $salaryData['basic_salary'];
                        $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 8 * 22; // 8 hours, 22 days
                        break;
                }

                EmployeeSalary::create($newSalary);
            }

            return redirect()->route('employees.show', $employee->id)
                ->with('success', 'Employee created successfully.');

        } catch (\Exception $e) {
            \Log::error('Employee creation failed: ' . $e->getMessage());
            return back()->withInput()->withErrors(['error' => 'Employee creation failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        return Inertia::render('Employee/Show', ['employee' => $employee]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee)
    {
        // Make sure dates are properly formatted for the frontend
        $employee->birth_date = $employee->birth_date ? $employee->birth_date->format('Y-m-d') : null;
        $employee->date_hired = $employee->date_hired ? $employee->date_hired->format('Y-m-d') : null;

        return Inertia::render('Employee/Edit', ['employee' => $employee]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        try {
            \Log::info('Updating employee: ' . $employee->id . ' with data: ' . json_encode($request->all()));

            $validated = $request->validate([
                'employee_id' => [
                    'required',
                    'string',
                    Rule::unique('employees')->ignore($employee->id),
                ],
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'suffix' => 'nullable|string|max:50',
                'birth_date' => 'required|date',
                'gender' => 'required|string',
                'civil_status' => 'required|string',
                'nationality' => 'required|string|max:255',
                'address' => 'required|string',
                'contact_number' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_number' => 'required|string|max:20',
                'tin_number' => 'nullable|string|max:50',
                'sss_number' => 'nullable|string|max:50',
                'philhealth_number' => 'nullable|string|max:50',
                'pagibig_number' => 'nullable|string|max:50',
                'date_hired' => 'required|date',
                'employment_status' => 'required|string',
                'department' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'status' => 'required|string|in:Active,Inactive,On Leave,Terminated',
                'basic_salary' => 'nullable|numeric|min:0',
                'salary_type' => 'nullable|string|in:Monthly,Semi-Monthly,Weekly,Daily,Hourly',
            ]);

            // Extract salary fields from validated data
            $salaryData = [
                'basic_salary' => $validated['basic_salary'] ?? null,
                'salary_type' => $validated['salary_type'] ?? 'Monthly',
            ];

            // Remove salary fields from employee data
            unset($validated['basic_salary']);
            unset($validated['salary_type']);

            // Update employee data
            $employee->update($validated);

            // Update or create salary record if salary data is provided
            if (!empty($salaryData['basic_salary'])) {
                $currentSalary = $employee->currentSalary;

                if ($currentSalary) {
                    // Reset all rates to 0 first to avoid calculation issues
                    $currentSalary->hourly_rate = 0;
                    $currentSalary->daily_rate = 0;
                    $currentSalary->semi_monthly_rate = 0;
                    $currentSalary->monthly_rate = 0;

                    // Update the appropriate rate based on salary_type
                    switch ($salaryData['salary_type']) {
                        case 'Monthly':
                            $currentSalary->monthly_rate = $salaryData['basic_salary'];
                            break;
                        case 'Semi-Monthly':
                            $currentSalary->semi_monthly_rate = $salaryData['basic_salary'];
                            $currentSalary->monthly_rate = $salaryData['basic_salary'] * 2;
                            break;
                        case 'Weekly':
                            $currentSalary->daily_rate = $salaryData['basic_salary'] / 5; // Assuming 5-day work week
                            $currentSalary->monthly_rate = $salaryData['basic_salary'] * 4.33; // Average weeks in a month
                            break;
                        case 'Daily':
                            $currentSalary->daily_rate = $salaryData['basic_salary'];
                            $currentSalary->monthly_rate = $salaryData['basic_salary'] * 22; // Assuming 22 working days
                            break;
                        case 'Hourly':
                            $currentSalary->hourly_rate = $salaryData['basic_salary'];
                            $currentSalary->monthly_rate = $salaryData['basic_salary'] * 8 * 22; // 8 hours, 22 days
                            break;
                    }

                    $currentSalary->save();
                } else {
                    // Create new salary record
                    $newSalary = [
                        'employee_id' => $employee->id,
                        'effective_date' => now(),
                        'is_active' => true,
                        'hourly_rate' => 0,
                        'daily_rate' => 0,
                        'semi_monthly_rate' => 0,
                        'monthly_rate' => 0,
                        'minute_rate' => 0,
                    ];

                    // Set the appropriate rate based on salary_type
                    switch ($salaryData['salary_type']) {
                        case 'Monthly':
                            $newSalary['monthly_rate'] = $salaryData['basic_salary'];
                            break;
                        case 'Semi-Monthly':
                            $newSalary['semi_monthly_rate'] = $salaryData['basic_salary'];
                            $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 2;
                            break;
                        case 'Weekly':
                            $newSalary['daily_rate'] = $salaryData['basic_salary'] / 5; // Assuming 5-day work week
                            $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 4.33; // Average weeks in a month
                            break;
                        case 'Daily':
                            $newSalary['daily_rate'] = $salaryData['basic_salary'];
                            $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 22; // Assuming 22 working days
                            break;
                        case 'Hourly':
                            $newSalary['hourly_rate'] = $salaryData['basic_salary'];
                            $newSalary['monthly_rate'] = $salaryData['basic_salary'] * 8 * 22; // 8 hours, 22 days
                            break;
                    }

                    EmployeeSalary::create($newSalary);
                }
            }

            \Log::info('Employee updated successfully: ' . $employee->id);

            return redirect()->route('employees.show', $employee->id)
                ->with('success', 'Employee updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Employee update failed: ' . $e->getMessage());
            return back()->withInput()->withErrors(['error' => 'Employee update failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }

    /**
     * Display a listing of the trashed employees.
     */
    public function trashed()
    {
        $employees = Employee::onlyTrashed()->orderBy('last_name')->get();
        return Inertia::render('Employee/Trashed', ['employees' => $employees]);
    }

    /**
     * Restore the specified trashed employee.
     */
    public function restore($employeeId)
    {
        $employee = Employee::onlyTrashed()->findOrFail($employeeId);
        $employee->restore();

        return redirect()->route('employees.index')
            ->with('success', 'Employee restored successfully.');
    }

    /**
     * Permanently delete the specified employee from storage.
     */
    public function forceDelete($employeeId)
    {
        $employee = Employee::onlyTrashed()->findOrFail($employeeId);
        $employee->forceDelete();

        return redirect()->route('employees.trashed')
            ->with('success', 'Employee permanently deleted successfully.');
    }
}