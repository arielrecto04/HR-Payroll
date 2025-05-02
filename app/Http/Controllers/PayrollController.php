<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class PayrollController extends Controller
{
    /**
     * Display a listing of the payrolls.
     */
    public function index(Request $request)
    {
        $query = Payroll::with('employee')
            ->orderBy('payment_date', 'desc');

        // Filter by date range if provided
        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }

        // Filter by employee if provided
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->withStatus($request->status);
        }

        $payrolls = $query->paginate(15);
        $employees = Employee::orderBy('last_name')->get();

        return Inertia::render('Payroll/Index', [
            'payrollRuns' => $payrolls,
            'employees' => $employees,
            'filters' => $request->only(['start_date', 'end_date', 'employee_id', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new payroll.
     */
    public function create()
    {
        $employees = Employee::orderBy('last_name')->get();
        $today = Carbon::now()->format('Y-m-d');
        $startOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');
        $endOfMonth = Carbon::now()->endOfMonth()->format('Y-m-d');

        return Inertia::render('Payroll/Generate', [
            'employees' => $employees,
            'today' => $today,
            'startOfMonth' => $startOfMonth,
            'endOfMonth' => $endOfMonth
        ]);
    }

    /**
     * Store a newly created payroll in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'payroll_period' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        // Check for existing payroll in the same period
        $existingPayroll = Payroll::where('employee_id', $validated['employee_id'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']]);
            })->first();

        if ($existingPayroll) {
            return back()->withErrors([
                'employee_id' => 'Payroll record already exists for this employee in the selected period.'
            ])->withInput();
        }

        // Initialize with draft status
        $validated['status'] = 'draft';

        // Create basic payroll record
        $payroll = Payroll::create($validated);

        // Process the payroll
        $payroll->process()->save();

        return redirect()->route('payrolls.show', $payroll->id)
            ->with('success', 'Payroll record created and processed successfully.');
    }

    /**
     * Display the specified payroll.
     */
    public function show(Payroll $payroll)
    {
        $payroll->load(['employee', 'attendances', 'overtimeRecords']);

        return Inertia::render('Payroll/Show', [
            'payroll' => $payroll
        ]);
    }

    /**
     * Show the form for editing the specified payroll.
     */
    public function edit(Payroll $payroll)
    {
        // Only allow editing of draft payrolls
        if ($payroll->status !== 'draft') {
            return redirect()->route('payrolls.show', $payroll->id)
                ->with('error', 'Only draft payrolls can be edited.');
        }

        $payroll->load('employee');
        $employees = Employee::orderBy('last_name')->get();

        return Inertia::render('Payroll/Edit', [
            'payroll' => $payroll,
            'employees' => $employees
        ]);
    }

    /**
     * Update the specified payroll in storage.
     */
    public function update(Request $request, Payroll $payroll)
    {
        // Only allow updating of draft payrolls
        if ($payroll->status !== 'draft') {
            return redirect()->route('payrolls.show', $payroll->id)
                ->with('error', 'Only draft payrolls can be updated.');
        }

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'payroll_period' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        // Check for existing payroll in the same period (excluding the current one)
        $existingPayroll = Payroll::where('employee_id', $validated['employee_id'])
            ->where('id', '!=', $payroll->id)
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']]);
            })->first();

        if ($existingPayroll) {
            return back()->withErrors([
                'employee_id' => 'Payroll record already exists for this employee in the selected period.'
            ])->withInput();
        }

        // Update basic payroll data
        $payroll->update($validated);

        // Reprocess the payroll
        $payroll->process()->save();

        return redirect()->route('payrolls.show', $payroll->id)
            ->with('success', 'Payroll record updated and reprocessed successfully.');
    }

    /**
     * Remove the specified payroll from storage.
     */
    public function destroy(Payroll $payroll)
    {
        // Only allow deletion of draft payrolls
        if ($payroll->status !== 'draft') {
            return redirect()->route('payrolls.show', $payroll->id)
                ->with('error', 'Only draft payrolls can be deleted.');
        }

        $payroll->delete();

        return redirect()->route('payrolls.index')
            ->with('success', 'Payroll record deleted successfully.');
    }

    /**
     * Approve the specified payroll.
     */
    public function approve(Payroll $payroll)
    {
        if ($payroll->status !== 'processing') {
            return redirect()->route('payrolls.show', $payroll->id)
                ->with('error', 'Only processing payrolls can be approved.');
        }

        $payroll->approve();

        return redirect()->route('payrolls.show', $payroll->id)
            ->with('success', 'Payroll approved successfully.');
    }

    /**
     * Mark the specified payroll as paid.
     */
    public function markAsPaid(Request $request, Payroll $payroll)
    {
        if ($payroll->status !== 'approved') {
            return redirect()->route('payrolls.show', $payroll->id)
                ->with('error', 'Only approved payrolls can be marked as paid.');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $payroll->markAsPaid($validated['notes'] ?? null);

        return redirect()->route('payrolls.show', $payroll->id)
            ->with('success', 'Payroll marked as paid successfully.');
    }

    /**
     * Generate payroll report for multiple employees.
     */
    public function generateBatch(Request $request)
    {
        $validated = $request->validate([
            'payroll_period' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_date' => 'required|date',
            'employee_ids' => 'required|array',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        $created = 0;
        $skipped = 0;

        DB::beginTransaction();
        try {
            foreach ($validated['employee_ids'] as $employeeId) {
                // Check for existing payroll in the same period
                $existingPayroll = Payroll::where('employee_id', $employeeId)
                    ->where(function ($query) use ($validated) {
                        $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                            ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']]);
                    })->first();

                if ($existingPayroll) {
                    $skipped++;
                    continue;
                }

                // Create payroll
                $payroll = Payroll::create([
                    'employee_id' => $employeeId,
                    'payroll_period' => $validated['payroll_period'],
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'payment_date' => $validated['payment_date'],
                    'status' => 'draft',
                ]);

                // Process
                $payroll->process()->save();
                $created++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('payrolls.index')
                ->with('error', 'Error generating batch payroll: ' . $e->getMessage());
        }

        return redirect()->route('payrolls.index')
            ->with('success', "Batch payroll processing completed. Created: $created, Skipped: $skipped");
    }
}