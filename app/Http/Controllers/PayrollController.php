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
        \Log::info('Payroll store request data:', $request->all());

        // First, check if we have selected employees in the request
        if ($request->has('selected_employees') && !empty($request->selected_employees)) {
            // This is coming from the Generate.jsx form with selected_employees array
            $employees = $request->selected_employees;

            // Check if we're generating for a single employee or a batch
            if (count($employees) == 1) {
                // Handle single employee payroll
                return $this->createSinglePayroll($request, $employees[0]);
            } else {
                // Handle batch payroll
                return $this->generateBatch($request);
            }
        } else {
            // Traditional validation for direct API calls or different forms
            $validated = $request->validate([
                'employee_id' => 'required|exists:employees,id',
                'payroll_period' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'payment_date' => 'required|date',
                'remarks' => 'nullable|string',
            ]);

            \Log::info('Traditional payroll validation data:', $validated);

            return $this->createPayrollFromValidated($validated);
        }
    }

    /**
     * Create a single payroll entry from the Generate form
     */
    protected function createSinglePayroll($request, $employeeData)
    {
        \Log::info('Creating single payroll from form data:', ['employee' => $employeeData, 'request' => $request->all()]);

        // Basic validation
        $request->validate([
            'payroll_period' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_date' => 'required|date',
        ]);

        // Prepare data for Payroll creation
        $data = [
            'employee_id' => $employeeData['employee_id'],
            'payroll_period' => $request->payroll_period,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'payment_date' => $request->payment_date,
            'remarks' => $request->remarks ?? $request->description,
            'status' => 'draft',
            'monthly_salary' => $employeeData['basic_pay'] ?? 0,
            'days_worked' => $employeeData['days_worked'] ?? 0,
            'overtime_hours' => $employeeData['overtime_hours'] ?? 0,
            'regular_earnings' => $employeeData['basic_pay'] ?? 0,
            'overtime_earnings' => $employeeData['overtime_pay'] ?? 0,
            'allowances' => $employeeData['allowances'] ?? 0,
            'other_earnings' => $employeeData['other_earnings'] ?? 0,
            'sss_contribution' => $employeeData['sss_contribution'] ?? 0,
            'philhealth_contribution' => $employeeData['philhealth_contribution'] ?? 0,
            'pagibig_contribution' => $employeeData['pagibig_contribution'] ?? 0,
            'tax_withheld' => $employeeData['withholding_tax'] ?? 0,
            'loan_deductions' => ($employeeData['sss_loan'] ?? 0) + ($employeeData['pagibig_loan'] ?? 0),
            'other_deductions' => $employeeData['other_deductions'] ?? 0,
            'gross_pay' => $employeeData['gross_pay'] ?? 0,
            'total_deductions' => $employeeData['total_deductions'] ?? 0,
            'net_pay' => $employeeData['net_pay'] ?? 0,
        ];

        // Check for existing payroll
        $existingPayroll = Payroll::where('employee_id', $data['employee_id'])
            ->where(function ($query) use ($data) {
                $query->whereBetween('start_date', [$data['start_date'], $data['end_date']])
                    ->orWhereBetween('end_date', [$data['start_date'], $data['end_date']]);
            })->first();

        if ($existingPayroll) {
            \Log::warning('Duplicate payroll found for employee_id: ' . $data['employee_id']);
            return back()->withErrors([
                'employee_id' => 'Payroll record already exists for this employee in the selected period.'
            ])->withInput();
        }

        try {
            // Enable query logging
            \DB::enableQueryLog();

            // Create the payroll record
            $payroll = Payroll::create($data);
            \Log::info('Payroll record created with ID: ' . $payroll->id, $data);

            // Log queries executed
            \Log::info('DB Queries executed during payroll create:', \DB::getQueryLog());
            \DB::disableQueryLog();

            return redirect()->route('payroll.show', $payroll->id)
                ->with('success', 'Payroll record created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error creating payroll: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return back()->withErrors(['error' => 'Failed to create payroll: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Create a payroll from validated data (original method)
     */
    protected function createPayrollFromValidated($validated)
    {
        // Check for existing payroll in the same period
        $existingPayroll = Payroll::where('employee_id', $validated['employee_id'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']]);
            })->first();

        if ($existingPayroll) {
            \Log::warning('Duplicate payroll found for employee_id: ' . $validated['employee_id']);
            return back()->withErrors([
                'employee_id' => 'Payroll record already exists for this employee in the selected period.'
            ])->withInput();
        }

        try {
            // Enable query logging
            \DB::enableQueryLog();

            // Initialize with draft status
            $validated['status'] = 'draft';

            // Ensure monthly_salary has a default value
            $validated['monthly_salary'] = $validated['monthly_salary'] ?? 0;

            // Create basic payroll record
            $payroll = Payroll::create($validated);
            \Log::info('Payroll record created with ID: ' . $payroll->id);

            // Log queries executed so far
            \Log::info('DB Queries executed during payroll create:', \DB::getQueryLog());

            // Reset query log
            \DB::flushQueryLog();
            \DB::enableQueryLog();

            // Process the payroll
            $payroll->process()->save();
            \Log::info('Payroll processed successfully');
            \Log::info('DB Queries executed during payroll process:', \DB::getQueryLog());

            // Disable query logging
            \DB::disableQueryLog();

            return redirect()->route('payroll.show', $payroll->id)
                ->with('success', 'Payroll record created and processed successfully.');
        } catch (\Exception $e) {
            \Log::error('Error creating payroll: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return back()->withErrors(['error' => 'Failed to create payroll: ' . $e->getMessage()])->withInput();
        }
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
            return redirect()->route('payroll.show', $payroll->id)
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
            return redirect()->route('payroll.show', $payroll->id)
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

        return redirect()->route('payroll.show', $payroll->id)
            ->with('success', 'Payroll record updated and reprocessed successfully.');
    }

    /**
     * Remove the specified payroll from storage.
     */
    public function destroy(Payroll $payroll)
    {
        // Only allow deletion of draft payrolls
        if ($payroll->status !== 'draft') {
            return redirect()->route('payroll.show', $payroll->id)
                ->with('error', 'Only draft payrolls can be deleted.');
        }

        $payroll->delete();

        return redirect()->route('payroll.index')
            ->with('success', 'Payroll record deleted successfully.');
    }

    /**
     * Approve the specified payroll.
     */
    public function approve(Payroll $payroll)
    {
        if ($payroll->status !== 'processing') {
            return redirect()->route('payroll.show', $payroll->id)
                ->with('error', 'Only processing payrolls can be approved.');
        }

        $payroll->approve();

        return redirect()->route('payroll.show', $payroll->id)
            ->with('success', 'Payroll approved successfully.');
    }

    /**
     * Mark the specified payroll as paid.
     */
    public function markAsPaid(Request $request, Payroll $payroll)
    {
        if ($payroll->status !== 'approved') {
            return redirect()->route('payroll.show', $payroll->id)
                ->with('error', 'Only approved payrolls can be marked as paid.');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $payroll->markAsPaid($validated['notes'] ?? null);

        return redirect()->route('payroll.show', $payroll->id)
            ->with('success', 'Payroll marked as paid successfully.');
    }

    /**
     * Generate payroll report for multiple employees.
     */
    public function generateBatch(Request $request)
    {
        \Log::info('Running batch payroll generation with data:', $request->all());

        // Validate the basic request data
        $request->validate([
            'payroll_period' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_date' => 'required|date',
        ]);

        // Extract employee IDs from the selected_employees array if available
        if ($request->has('selected_employees')) {
            $employeeData = collect($request->selected_employees);
            $employeeIds = $employeeData->pluck('employee_id')->toArray();
        } else {
            $employeeIds = $request->input('employee_ids', []);
        }

        if (empty($employeeIds)) {
            return back()->withErrors([
                'error' => 'No employees selected for batch payroll generation.'
            ])->withInput();
        }

        $created = 0;
        $skipped = 0;

        DB::beginTransaction();
        try {
            foreach ($employeeIds as $index => $employeeId) {
                // Check for existing payroll in the same period
                $existingPayroll = Payroll::where('employee_id', $employeeId)
                    ->where(function ($query) use ($request) {
                        $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                            ->orWhereBetween('end_date', [$request->start_date, $request->end_date]);
                    })->first();

                if ($existingPayroll) {
                    $skipped++;
                    continue;
                }

                // Find the employee data from the selected_employees array if available
                $singleEmployeeData = null;
                if ($request->has('selected_employees')) {
                    $singleEmployeeData = collect($request->selected_employees)
                        ->firstWhere('employee_id', $employeeId);
                }

                // Create payroll with default values
                $payrollData = [
                    'employee_id' => $employeeId,
                    'payroll_period' => $request->payroll_period,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'payment_date' => $request->payment_date,
                    'remarks' => $request->remarks ?? $request->description,
                    'status' => 'draft',
                    'monthly_salary' => 0,
                ];

                // Add additional data from the form if available
                if ($singleEmployeeData) {
                    $payrollData = array_merge($payrollData, [
                        'monthly_salary' => $singleEmployeeData['basic_pay'] ?? 0,
                        'days_worked' => $singleEmployeeData['days_worked'] ?? 0,
                        'overtime_hours' => $singleEmployeeData['overtime_hours'] ?? 0,
                        'regular_earnings' => $singleEmployeeData['basic_pay'] ?? 0,
                        'overtime_earnings' => $singleEmployeeData['overtime_pay'] ?? 0,
                        'allowances' => $singleEmployeeData['allowances'] ?? 0,
                        'other_earnings' => $singleEmployeeData['other_earnings'] ?? 0,
                        'sss_contribution' => $singleEmployeeData['sss_contribution'] ?? 0,
                        'philhealth_contribution' => $singleEmployeeData['philhealth_contribution'] ?? 0,
                        'pagibig_contribution' => $singleEmployeeData['pagibig_contribution'] ?? 0,
                        'tax_withheld' => $singleEmployeeData['withholding_tax'] ?? 0,
                        'loan_deductions' => ($singleEmployeeData['sss_loan'] ?? 0) + ($singleEmployeeData['pagibig_loan'] ?? 0),
                        'other_deductions' => $singleEmployeeData['other_deductions'] ?? 0,
                        'gross_pay' => $singleEmployeeData['gross_pay'] ?? 0,
                        'total_deductions' => $singleEmployeeData['total_deductions'] ?? 0,
                        'net_pay' => $singleEmployeeData['net_pay'] ?? 0,
                    ]);
                }

                // Create payroll
                $payroll = Payroll::create($payrollData);

                // Process the payroll if we don't have detailed data already
                if (!$singleEmployeeData) {
                    $payroll->process()->save();
                }

                $created++;
            }

            DB::commit();

            \Log::info("Batch payroll generation completed: created=$created, skipped=$skipped");
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in batch payroll generation: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return redirect()->route('payroll.index')
                ->with('error', 'Error generating batch payroll: ' . $e->getMessage());
        }

        return redirect()->route('payroll.index')
            ->with('success', "Batch payroll processing completed. Created: $created, Skipped: $skipped");
    }

    /**
     * Display payroll reports interface.
     */
    public function reports()
    {
        return Inertia::render('Payroll/Reports', [
            'reportTypes' => [
                'payroll_summary' => 'Payroll Summary Report',
                'tax_report' => 'Tax Withholding Report',
                'earnings_report' => 'Earnings Report',
                'deductions_report' => 'Deductions Report',
            ]
        ]);
    }

    /**
     * Display government remittances interface.
     */
    public function remittances()
    {
        return Inertia::render('Payroll/Remittances', [
            'remittanceTypes' => [
                'sss' => 'SSS Contributions',
                'philhealth' => 'PhilHealth Contributions',
                'pagibig' => 'Pag-IBIG Contributions',
                'tax' => 'BIR Tax Remittances',
            ]
        ]);
    }

    /**
     * Display payslips for a payroll.
     */
    public function payslips(Payroll $payroll)
    {
        $payroll->load('employee');

        return Inertia::render('Payroll/Payslips', [
            'payroll' => $payroll,
        ]);
    }

    /**
     * Download the payslip as a PDF.
     */
    public function downloadPdf(Payroll $payroll)
    {
        $payroll->load('employee');

        $pdf = \PDF::loadView('pdf.payslip', ['payroll' => $payroll]);

        $filename = 'payslip_' . $payroll->employee->employee_id . '_' . $payroll->payroll_period . '.pdf';
        $filename = str_replace(' ', '_', $filename);

        return $pdf->download($filename);
    }
}