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
     * Get the employee that owns the attendance record.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
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
        return $query->where('employee_id', $employeeId);
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
}