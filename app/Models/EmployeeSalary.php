<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeSalary extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'monthly_rate',
        'semi_monthly_rate',
        'daily_rate',
        'hourly_rate',
        'minute_rate',
        'sss_contribution',
        'philhealth_contribution',
        'pagibig_contribution',
        'loan_deductions',
        'other_deductions',
        'tax_amount',
        'allowances',
        'other_additions',
        'effective_date',
        'end_date',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'monthly_rate' => 'decimal:2',
        'semi_monthly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'minute_rate' => 'decimal:2',
        'sss_contribution' => 'decimal:2',
        'philhealth_contribution' => 'decimal:2',
        'pagibig_contribution' => 'decimal:2',
        'loan_deductions' => 'decimal:2',
        'other_deductions' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'allowances' => 'decimal:2',
        'other_additions' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->calculateAllRates();
        });
    }

    /**
     * Calculate all rates based on the monthly rate.
     * Monthly rate is always the base rate from which all others are calculated.
     */
    public function calculateAllRates()
    {
        // Constants for calculations (adjustable as needed)
        $workDaysPerMonth = 22;  // Average number of working days in a month
        $workHoursPerDay = 8;    // Standard working hours per day

        // Calculate everything from monthly rate
        if ($this->monthly_rate > 0) {
            $this->semi_monthly_rate = $this->monthly_rate / 2;
            $this->daily_rate = $this->monthly_rate / $workDaysPerMonth;
            $this->hourly_rate = $this->daily_rate / $workHoursPerDay;
            $this->minute_rate = $this->hourly_rate / 60;
        }
    }

    /**
     * Get the employee that owns the salary.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Calculate the total deductions.
     *
     * @return float
     */
    public function getTotalDeductionsAttribute()
    {
        return $this->sss_contribution +
            $this->philhealth_contribution +
            $this->pagibig_contribution +
            $this->loan_deductions +
            $this->other_deductions +
            $this->tax_amount;
    }

    /**
     * Calculate the total additions.
     *
     * @return float
     */
    public function getTotalAdditionsAttribute()
    {
        return $this->allowances + $this->other_additions;
    }

    /**
     * Calculate the net monthly salary.
     *
     * @return float
     */
    public function getNetSalaryAttribute()
    {
        return $this->monthly_rate - $this->total_deductions + $this->total_additions;
    }
}