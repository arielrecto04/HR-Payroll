<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class OvertimeRecord extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'attendance_id',
        'type',
        'hours',
        'start_time',
        'end_time',
        'rate_multiplier',
        'remarks',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hours' => 'decimal:2',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'rate_multiplier' => 'decimal:2',
    ];

    /**
     * The overtime type labels.
     *
     * @var array<string, string>
     */
    public static $typeLabels = [
        'regular_overtime' => 'Regular Overtime',
        'rest_day' => 'Rest Day & Special Holiday',
        'special_holiday' => 'Special Holiday',
        'special_holiday_rest_day' => 'Special Holiday on Rest Day',
        'legal_holiday' => 'Legal Holiday',
        'night_differential' => 'Night Differential',
    ];

    /**
     * Get the attendance record that owns the overtime.
     */
    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }

    /**
     * Get the employee through the attendance relationship.
     */
    public function employee()
    {
        return $this->attendance->employee;
    }

    /**
     * Get the human-readable label for the overtime type.
     */
    public function getTypeNameAttribute()
    {
        return self::$typeLabels[$this->type] ?? $this->type;
    }

    /**
     * Calculate the duration based on start and end times.
     *
     * @return void
     */
    public function calculateHours()
    {
        if ($this->start_time && $this->end_time) {
            $startTime = Carbon::parse($this->start_time);
            $endTime = Carbon::parse($this->end_time);

            // Handle cases where overtime spans past midnight
            if ($endTime < $startTime) {
                $endTime->addDay();
            }

            $diffInMinutes = $endTime->diffInMinutes($startTime);
            $this->hours = round($diffInMinutes / 60, 2);
        }
    }

    /**
     * Set default rate multipliers based on type.
     *
     * @return void
     */
    public function setDefaultMultiplier()
    {
        // Example rate multipliers - adjust according to your company policy
        $multipliers = [
            'regular_overtime' => 1.25,        // 25% premium
            'rest_day' => 1.30,                // 30% premium
            'special_holiday' => 1.30,         // 30% premium
            'special_holiday_rest_day' => 1.50, // 50% premium
            'legal_holiday' => 2.00,           // 100% premium (double pay)
            'night_differential' => 1.10,       // 10% premium
        ];

        if (isset($multipliers[$this->type])) {
            $this->rate_multiplier = $multipliers[$this->type];
        }
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($overtimeRecord) {
            if (!$overtimeRecord->rate_multiplier) {
                $overtimeRecord->setDefaultMultiplier();
            }

            if ($overtimeRecord->start_time && $overtimeRecord->end_time && !$overtimeRecord->hours) {
                $overtimeRecord->calculateHours();
            }
        });
    }
}