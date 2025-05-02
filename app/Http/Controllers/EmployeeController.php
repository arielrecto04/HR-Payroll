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
                'employee_id' => 'required|string|unique:employees,employee_id',
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
            ]);

            // Create employee record
            $employee = new Employee();
            $employee->fill($validatedEmployee);
            $employee->save();

            // Validate salary fields if provided
            $validatedSalary = $request->validate([
                'basic_salary' => 'nullable|numeric|min:0',
                'salary_type' => 'nullable|string|in:Monthly,Semi-Monthly,Weekly,Daily,Hourly',
            ]);

            // If salary information was provided, create a salary record
            if (!empty($validatedSalary['basic_salary'])) {
                $salaryData = [
                    'employee_id' => $employee->id,
                    'effective_date' => $validatedEmployee['date_hired'],
                    'is_active' => true,
                ];

                // Set the appropriate rate based on salary_type
                switch ($validatedSalary['salary_type'] ?? 'Monthly') {
                    case 'Monthly':
                        $salaryData['monthly_rate'] = $validatedSalary['basic_salary'];
                        break;
                    case 'Semi-Monthly':
                        $salaryData['semi_monthly_rate'] = $validatedSalary['basic_salary'];
                        $salaryData['monthly_rate'] = $validatedSalary['basic_salary'] * 2;
                        break;
                    case 'Weekly':
                        $salaryData['daily_rate'] = $validatedSalary['basic_salary'] / 5; // Assuming 5-day work week
                        $salaryData['monthly_rate'] = $validatedSalary['basic_salary'] * 4.33; // Average weeks in a month
                        break;
                    case 'Daily':
                        $salaryData['daily_rate'] = $validatedSalary['basic_salary'];
                        $salaryData['monthly_rate'] = $validatedSalary['basic_salary'] * 22; // Assuming 22 working days
                        break;
                    case 'Hourly':
                        $salaryData['hourly_rate'] = $validatedSalary['basic_salary'];
                        $salaryData['monthly_rate'] = $validatedSalary['basic_salary'] * 8 * 22; // 8 hours, 22 days
                        break;
                }

                // Create the salary record
                EmployeeSalary::create($salaryData);
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
        return Inertia::render('Employee/Edit', ['employee' => $employee]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(Request $request, Employee $employee)
    {
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
        ]);

        $employee->update($validated);

        return redirect()->route('employees.show', $employee->id)
            ->with('success', 'Employee updated successfully.');
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