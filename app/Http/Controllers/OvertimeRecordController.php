<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\OvertimeRecord;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OvertimeRecordController extends Controller
{
    /**
     * Display a listing of the overtime records.
     */
    public function index(Request $request)
    {
        $query = OvertimeRecord::with(['attendance.employee'])
            ->orderBy('created_at', 'desc');

        // Filter by date range if provided
        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereHas('attendance', function ($q) use ($request) {
                $q->whereBetween('date', [$request->start_date, $request->end_date]);
            });
        }

        // Filter by employee if provided
        if ($request->filled('employee_id')) {
            $query->whereHas('attendance', function ($q) use ($request) {
                $q->where('employee_id', $request->employee_id);
            });
        }

        // Filter by type if provided
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $overtimeRecords = $query->paginate(15);

        return view('overtime-records.index', compact('overtimeRecords'));
    }

    /**
     * Show the form for creating a new overtime record.
     */
    public function create(Request $request)
    {
        $attendance = null;

        if ($request->has('attendance_id')) {
            $attendance = Attendance::with('employee')->findOrFail($request->attendance_id);
        }

        $typeOptions = OvertimeRecord::$typeLabels;

        return view('overtime-records.create', compact('attendance', 'typeOptions'));
    }

    /**
     * Store a newly created overtime record in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'attendance_id' => 'required|exists:attendances,id',
            'type' => 'required|in:regular_overtime,rest_day,special_holiday,special_holiday_rest_day,legal_holiday,night_differential',
            'hours' => 'nullable|numeric|min:0|max:24',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'rate_multiplier' => 'nullable|numeric|min:1|max:3',
            'remarks' => 'nullable|string',
        ]);

        // If hours is not provided but start_time and end_time are, calculate hours
        if (empty($validated['hours']) && isset($validated['start_time']) && isset($validated['end_time'])) {
            $attendance = Attendance::findOrFail($validated['attendance_id']);

            $startTime = Carbon::parse($attendance->date->format('Y-m-d') . ' ' . $validated['start_time']);
            $endTime = Carbon::parse($attendance->date->format('Y-m-d') . ' ' . $validated['end_time']);

            // If end_time is before start_time, assume it's the next day
            if ($endTime < $startTime) {
                $endTime->addDay();
            }

            $validated['hours'] = $endTime->diffInMinutes($startTime) / 60;
        }

        $validated['status'] = 'pending';

        $overtimeRecord = OvertimeRecord::create($validated);

        return redirect()->route('attendances.show', $overtimeRecord->attendance_id)
            ->with('success', 'Overtime record created successfully.');
    }

    /**
     * Display the specified overtime record.
     */
    public function show(OvertimeRecord $overtimeRecord)
    {
        $overtimeRecord->load('attendance.employee');

        return view('overtime-records.show', compact('overtimeRecord'));
    }

    /**
     * Show the form for editing the specified overtime record.
     */
    public function edit(OvertimeRecord $overtimeRecord)
    {
        $overtimeRecord->load('attendance.employee');
        $typeOptions = OvertimeRecord::$typeLabels;

        return view('overtime-records.edit', compact('overtimeRecord', 'typeOptions'));
    }

    /**
     * Update the specified overtime record in storage.
     */
    public function update(Request $request, OvertimeRecord $overtimeRecord)
    {
        $validated = $request->validate([
            'type' => 'required|in:regular_overtime,rest_day,special_holiday,special_holiday_rest_day,legal_holiday,night_differential',
            'hours' => 'nullable|numeric|min:0|max:24',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'rate_multiplier' => 'nullable|numeric|min:1|max:3',
            'remarks' => 'nullable|string',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // If hours is not provided but start_time and end_time are, calculate hours
        if (empty($validated['hours']) && isset($validated['start_time']) && isset($validated['end_time'])) {
            $attendance = $overtimeRecord->attendance;

            $startTime = Carbon::parse($attendance->date->format('Y-m-d') . ' ' . $validated['start_time']);
            $endTime = Carbon::parse($attendance->date->format('Y-m-d') . ' ' . $validated['end_time']);

            // If end_time is before start_time, assume it's the next day
            if ($endTime < $startTime) {
                $endTime->addDay();
            }

            $validated['hours'] = $endTime->diffInMinutes($startTime) / 60;
        }

        $overtimeRecord->update($validated);

        return redirect()->route('attendances.show', $overtimeRecord->attendance_id)
            ->with('success', 'Overtime record updated successfully.');
    }

    /**
     * Remove the specified overtime record from storage.
     */
    public function destroy(OvertimeRecord $overtimeRecord)
    {
        $attendanceId = $overtimeRecord->attendance_id;
        $overtimeRecord->delete();

        return redirect()->route('attendances.show', $attendanceId)
            ->with('success', 'Overtime record deleted successfully.');
    }

    /**
     * Approve the specified overtime record.
     */
    public function approve(OvertimeRecord $overtimeRecord)
    {
        $overtimeRecord->update(['status' => 'approved']);

        return redirect()->route('attendances.show', $overtimeRecord->attendance_id)
            ->with('success', 'Overtime record approved successfully.');
    }

    /**
     * Reject the specified overtime record.
     */
    public function reject(OvertimeRecord $overtimeRecord)
    {
        $overtimeRecord->update(['status' => 'rejected']);

        return redirect()->route('attendances.show', $overtimeRecord->attendance_id)
            ->with('success', 'Overtime record rejected successfully.');
    }
}