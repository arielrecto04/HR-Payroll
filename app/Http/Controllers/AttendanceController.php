<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the attendances.
     */
    public function index(Request $request)
    {
        $query = Attendance::with('employee', 'overtimeRecords')
            ->orderBy('date', 'desc');

        // Filter by date range if provided
        if ($request->filled(['start_date', 'end_date'])) {
            $query->forDateRange($request->start_date, $request->end_date);
        } else {
            // Default to current month if no date range specified
            $startOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');
            $endOfMonth = Carbon::now()->endOfMonth()->format('Y-m-d');
            $query->forDateRange($startOfMonth, $endOfMonth);
        }

        // Filter by employee if provided
        if ($request->filled('employee_id')) {
            $query->forEmployee($request->employee_id);
        }

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->paginate(15);

        $employees = Employee::orderBy('last_name')->get();

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
            'employees' => $employees,
            'filters' => $request->only(['start_date', 'end_date', 'employee_id', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new attendance.
     */
    public function create()
    {
        $employees = Employee::orderBy('last_name')->get();
        $today = Carbon::now()->format('Y-m-d');

        return Inertia::render('Attendance/Create', [
            'employees' => $employees,
            'today' => $today
        ]);
    }

    /**
     * Store a newly created attendance in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,employee_id',
            'date' => 'required|date',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after:time_in',
            'days_worked' => 'nullable|numeric|min:0|max:1',
            'late_minutes' => 'nullable|integer|min:0',
            'is_absent' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        // Check for existing attendance
        $existingAttendance = Attendance::where('employee_id', $validated['employee_id'])
            ->where('date', $validated['date'])
            ->first();

        if ($existingAttendance) {
            return back()->withErrors([
                'employee_id' => 'Attendance record already exists for this employee on the selected date.'
            ])->withInput();
        }

        // Auto-calculate days worked if not provided
        if (empty($validated['days_worked']) && isset($validated['time_in']) && isset($validated['time_out'])) {
            $timeIn = Carbon::parse($validated['date'] . ' ' . $validated['time_in']);
            $timeOut = Carbon::parse($validated['date'] . ' ' . $validated['time_out']);

            // If time out is before time in, assume it's the next day
            if ($timeOut < $timeIn) {
                $timeOut->addDay();
            }

            $hoursWorked = $timeOut->diffInMinutes($timeIn) / 60;
            $validated['days_worked'] = min(1, $hoursWorked / 8); // Assuming 8-hour workday
        }

        // If marked as absent, set defaults
        if (isset($validated['is_absent']) && $validated['is_absent']) {
            $validated['time_in'] = null;
            $validated['time_out'] = null;
            $validated['days_worked'] = 0;
            $validated['late_minutes'] = 0;
        }

        $validated['status'] = 'pending';

        $attendance = Attendance::create($validated);

        return redirect()->route('attendances.show', $attendance->id)
            ->with('success', 'Attendance record created successfully.');
    }

    /**
     * Display the specified attendance.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load(['employee', 'overtimeRecords']);

        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance
        ]);
    }

    /**
     * Show the form for editing the specified attendance.
     */
    public function edit(Attendance $attendance)
    {
        $attendance->load('employee');
        $employees = Employee::orderBy('last_name')->get();

        return Inertia::render('Attendance/Edit', [
            'attendance' => $attendance,
            'employees' => $employees
        ]);
    }

    /**
     * Update the specified attendance in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,employee_id',
            'date' => 'required|date',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after:time_in',
            'days_worked' => 'nullable|numeric|min:0|max:1',
            'late_minutes' => 'nullable|integer|min:0',
            'is_absent' => 'boolean',
            'remarks' => 'nullable|string',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Check for existing attendance (excluding the current one)
        $existingAttendance = Attendance::where('employee_id', $validated['employee_id'])
            ->where('date', $validated['date'])
            ->where('id', '!=', $attendance->id)
            ->first();

        if ($existingAttendance) {
            return back()->withErrors([
                'employee_id' => 'Attendance record already exists for this employee on the selected date.'
            ])->withInput();
        }

        // Auto-calculate days worked if not provided
        if (empty($validated['days_worked']) && isset($validated['time_in']) && isset($validated['time_out'])) {
            $timeIn = Carbon::parse($validated['date'] . ' ' . $validated['time_in']);
            $timeOut = Carbon::parse($validated['date'] . ' ' . $validated['time_out']);

            // If time out is before time in, assume it's the next day
            if ($timeOut < $timeIn) {
                $timeOut->addDay();
            }

            $hoursWorked = $timeOut->diffInMinutes($timeIn) / 60;
            $validated['days_worked'] = min(1, $hoursWorked / 8); // Assuming 8-hour workday
        }

        // If marked as absent, set defaults
        if (isset($validated['is_absent']) && $validated['is_absent']) {
            $validated['time_in'] = null;
            $validated['time_out'] = null;
            $validated['days_worked'] = 0;
            $validated['late_minutes'] = 0;
        }

        $attendance->update($validated);

        return redirect()->route('attendances.show', $attendance->id)
            ->with('success', 'Attendance record updated successfully.');
    }

    /**
     * Remove the specified attendance from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('attendances.index')
            ->with('success', 'Attendance record deleted successfully.');
    }

    /**
     * Approve the specified attendance.
     */
    public function approve(Attendance $attendance)
    {
        $attendance->update(['status' => 'approved']);

        return redirect()->route('attendances.show', $attendance->id)
            ->with('success', 'Attendance record approved successfully.');
    }

    /**
     * Reject the specified attendance.
     */
    public function reject(Attendance $attendance)
    {
        $attendance->update(['status' => 'rejected']);

        return redirect()->route('attendances.show', $attendance->id)
            ->with('success', 'Attendance record rejected successfully.');
    }

    /**
     * Bulk import attendance records.
     */
    public function import(Request $request)
    {
        // Placeholder for attendance import functionality
        return Inertia::render('Attendance/Import');
    }

    /**
     * Download attendance report.
     */
    public function export(Request $request)
    {
        // Placeholder for attendance export functionality
        return response()->json(['message' => 'Export feature will be implemented soon']);
    }
}