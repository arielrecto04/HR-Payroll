<?php

namespace App\Http\Controllers;

use App\Models\DeductionSetting;
use App\Models\Employee;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DeductionSettingController extends Controller
{
    /**
     * Display a listing of the deduction settings.
     */
    public function index(Request $request)
    {
        $query = DeductionSetting::with('employee')->orderBy('effective_date', 'desc');

        // Filter by employee if provided
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by effective date if provided
        if ($request->filled('effective_date')) {
            $query->effectiveOn($request->effective_date);
        }

        $deductionSettings = $query->paginate(15);
        $employees = Employee::orderBy('last_name')->get();

        return view('deduction-settings.index', compact('deductionSettings', 'employees'));
    }

    /**
     * Show the form for creating a new deduction setting.
     */
    public function create()
    {
        $employees = Employee::orderBy('last_name')->get();
        $today = Carbon::now()->format('Y-m-d');

        return view('deduction-settings.create', compact('employees', 'today'));
    }

    /**
     * Store a newly created deduction setting in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'sss_contribution' => 'required|numeric|min:0',
            'philhealth_contribution' => 'required|numeric|min:0',
            'pagibig_contribution' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:1',
            'tax_exemption' => 'required|numeric|min:0',
            'tax_status' => 'required|string',
            'loans' => 'nullable|array',
            'other_deductions' => 'nullable|array',
            'allowances' => 'nullable|numeric|min:0',
            'allowance_details' => 'nullable|array',
            'other_additions' => 'nullable|numeric|min:0',
            'addition_details' => 'nullable|array',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_active' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        // If this is active, deactivate other settings for this employee
        if ($validated['is_active'] ?? true) {
            DeductionSetting::where('employee_id', $validated['employee_id'])
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $deductionSetting = DeductionSetting::create($validated);

        return redirect()->route('deduction-settings.show', $deductionSetting->id)
            ->with('success', 'Deduction setting created successfully.');
    }

    /**
     * Display the specified deduction setting.
     */
    public function show(DeductionSetting $deductionSetting)
    {
        $deductionSetting->load('employee');

        return view('deduction-settings.show', compact('deductionSetting'));
    }

    /**
     * Show the form for editing the specified deduction setting.
     */
    public function edit(DeductionSetting $deductionSetting)
    {
        $deductionSetting->load('employee');
        $employees = Employee::orderBy('last_name')->get();

        return view('deduction-settings.edit', compact('deductionSetting', 'employees'));
    }

    /**
     * Update the specified deduction setting in storage.
     */
    public function update(Request $request, DeductionSetting $deductionSetting)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'sss_contribution' => 'required|numeric|min:0',
            'philhealth_contribution' => 'required|numeric|min:0',
            'pagibig_contribution' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:1',
            'tax_exemption' => 'required|numeric|min:0',
            'tax_status' => 'required|string',
            'loans' => 'nullable|array',
            'other_deductions' => 'nullable|array',
            'allowances' => 'nullable|numeric|min:0',
            'allowance_details' => 'nullable|array',
            'other_additions' => 'nullable|numeric|min:0',
            'addition_details' => 'nullable|array',
            'effective_date' => 'required|date',
            'end_date' => 'nullable|date|after:effective_date',
            'is_active' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        // If this is being activated, deactivate other settings for this employee
        if (($validated['is_active'] ?? false) && !$deductionSetting->is_active) {
            DeductionSetting::where('employee_id', $validated['employee_id'])
                ->where('id', '!=', $deductionSetting->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $deductionSetting->update($validated);

        return redirect()->route('deduction-settings.show', $deductionSetting->id)
            ->with('success', 'Deduction setting updated successfully.');
    }

    /**
     * Remove the specified deduction setting from storage.
     */
    public function destroy(DeductionSetting $deductionSetting)
    {
        $deductionSetting->delete();

        return redirect()->route('deduction-settings.index')
            ->with('success', 'Deduction setting deleted successfully.');
    }
}
