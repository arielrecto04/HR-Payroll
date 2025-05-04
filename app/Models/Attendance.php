<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'date',
        'time_in',
        'time_out',
        'days_worked',
        'late_minutes',
        'is_absent',
        'remarks',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'time_in' => 'datetime',
        'time_out' => 'datetime',
        'days_worked' => 'decimal:2',
        'late_minutes' => 'integer',
        'is_absent' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'total_hours',
        'total_overtime_hours',
        'time_in_formatted',
        'time_out_formatted',
        'time_in_for_input',
        'time_out_for_input',
        'date_formatted'
    ];

    /**
     * Get the employee that owns the attendance record.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }

    /**
     * Get the overtime records for this attendance.
     */
    public function overtimeRecords()
    {
        return $this->hasMany(OvertimeRecord::class);
    }

    /**
     * Calculate the total hours worked.
     *
     * @return float|null
     */
    public function getTotalHoursAttribute()
    {
        if ($this->time_in && $this->time_out) {
            $timeIn = Carbon::parse($this->time_in);
            $timeOut = Carbon::parse($this->time_out);

            // Handle cases where employee works past midnight
            if ($timeOut < $timeIn) {
                $timeOut->addDay();
            }

            $diffInMinutes = $timeOut->diffInMinutes($timeIn);
            return round($diffInMinutes / 60, 2);
        }

        return null;
    }

    /**
     * Calculate the total overtime hours.
     *
     * @return float
     */
    public function getTotalOvertimeHoursAttribute()
    {
        return $this->overtimeRecords()->sum('hours');
    }

    /**
     * Scope a query to only include attendances for a given employee.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $employeeId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForEmployee($query, $employeeId)
    {
        // Find the employee's numeric ID from their string employee_id
        $employee = Employee::where('employee_id', $employeeId)->first();

        if ($employee) {
            return $query->where('employee_id', $employee->id);
        }

        return $query;
    }

    /**
     * Scope a query to only include attendances for a given date range.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $startDate
     * @param  string  $endDate
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Get the time_in attribute formatted for display.
     *
     * @return string|null
     */
    public function getTimeInFormattedAttribute()
    {
        if ($this->time_in) {
            return Carbon::parse($this->time_in)->format('h:i A');
        }
        return null;
    }

    /**
     * Get the time_out attribute formatted for display.
     *
     * @return string|null
     */
    public function getTimeOutFormattedAttribute()
    {
        if ($this->time_out) {
            return Carbon::parse($this->time_out)->format('h:i A');
        }
        return null;
    }

    /**
     * Get the time_in attribute for form inputs (24-hour format).
     *
     * @return string|null
     */
    public function getTimeInForInputAttribute()
    {
        if ($this->time_in) {
            return Carbon::parse($this->time_in)->format('H:i');
        }
        return null;
    }

    /**
     * Get the time_out attribute for form inputs (24-hour format).
     *
     * @return string|null
     */
    public function getTimeOutForInputAttribute()
    {
        if ($this->time_out) {
            return Carbon::parse($this->time_out)->format('H:i');
        }
        return null;
    }

    /**
     * Get the date attribute formatted for display.
     *
     * @return string|null
     */
    public function getDateFormattedAttribute()
    {
        if ($this->date) {
            return $this->date->format('Y-m-d');
        }
        return null;
    }

    /**
     * Calculate days worked from time in and time out
     *
     * @param \Carbon\Carbon|string|null $timeIn
     * @param \Carbon\Carbon|string|null $timeOut
     * @param float $hoursPerDay
     * @return float
     */
    public static function calculateDaysWorked($timeIn, $timeOut, $hoursPerDay = 8.0)
    {
        if (!$timeIn || !$timeOut) {
            return 0;
        }

        $timeInCarbon = $timeIn instanceof Carbon ? $timeIn : Carbon::parse($timeIn);
        $timeOutCarbon = $timeOut instanceof Carbon ? $timeOut : Carbon::parse($timeOut);

        // If time out is before time in, assume it's the next day
        if ($timeOutCarbon->lt($timeInCarbon)) {
            $timeOutCarbon->addDay();
        }

        $hoursWorked = $timeOutCarbon->diffInMinutes($timeInCarbon) / 60;

        // Calculate days worked (capped at 1 day)
        return min(1, max(0, $hoursWorked / $hoursPerDay));
    }
}