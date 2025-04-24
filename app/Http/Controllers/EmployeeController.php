<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index()
    {
        $employees = Employee::orderBy('last_name')->get();
        return view('employees.index', compact('employees'));
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        return view('employees.create');
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
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
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_number' => 'required|string|max:20',
            'tin_number' => 'nullable|string|max:50',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'date_hired' => 'required|date',
            'employment_status' => 'required|string',
        ]);

        $employee = Employee::create($validated);

        return redirect()->route('employees.show', $employee->employee_id)
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        return view('employees.show', compact('employee'));
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee)
    {
        return view('employees.edit', compact('employee'));
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
                Rule::unique('employees')->ignore($employee->employee_id, 'employee_id'),
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
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_number' => 'required|string|max:20',
            'tin_number' => 'nullable|string|max:50',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'date_hired' => 'required|date',
            'employment_status' => 'required|string',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.show', $employee->employee_id)
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
        return view('employees.trashed', compact('employees'));
    }

    /**
     * Restore the specified trashed employee.
     */
    public function restore($employeeId)
    {
        $employee = Employee::onlyTrashed()->where('employee_id', $employeeId)->firstOrFail();
        $employee->restore();

        return redirect()->route('employees.index')
            ->with('success', 'Employee restored successfully.');
    }

    /**
     * Permanently delete the specified employee from storage.
     */
    public function forceDelete($employeeId)
    {
        $employee = Employee::onlyTrashed()->where('employee_id', $employeeId)->firstOrFail();
        $employee->forceDelete();

        return redirect()->route('employees.trashed')
            ->with('success', 'Employee permanently deleted successfully.');
    }
}