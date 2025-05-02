<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'payroll_period',
        'start_date',
        'end_date',
        'payment_date',
        'basic_salary',
        'regular_earnings',
        'overtime_earnings',
        'holiday_pay',
        'allowances',
        'other_earnings',
        'gross_pay',
        'sss_contribution',
        'philhealth_contribution',
        'pagibig_contribution',
        'tax_withheld',
        'loan_deductions',
        'other_deductions',
        'total_deductions',
        'net_pay',
        'days_worked',
        'overtime_hours',
        'attendance_details',
        'overtime_details',
        'deduction_details',
        'earning_details',
        'status',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'payment_date' => 'date',
        'basic_salary' => 'decimal:2',
        'regular_earnings' => 'decimal:2',
        'overtime_earnings' => 'decimal:2',
        'holiday_pay' => 'decimal:2',
        'allowances' => 'decimal:2',
        'other_earnings' => 'decimal:2',
        'gross_pay' => 'decimal:2',
        'sss_contribution' => 'decimal:2',
        'philhealth_contribution' => 'decimal:2',
        'pagibig_contribution' => 'decimal:2',
        'tax_withheld' => 'decimal:2',
        'loan_deductions' => 'decimal:2',
        'other_deductions' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_pay' => 'decimal:2',
        'days_worked' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
        'attendance_details' => 'array',
        'overtime_details' => 'array',
        'deduction_details' => 'array',
        'earning_details' => 'array',
    ];

    /**
     * Get the employee that owns the payroll.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the attendances for this payroll period.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'employee_id', 'employee_id')
            ->whereBetween('date', [$this->start_date, $this->end_date]);
    }

    /**
     * Get the overtime records for this payroll period.
     */
    public function overtimeRecords()
    {
        return $this->hasManyThrough(
            OvertimeRecord::class,
            Attendance::class,
            'employee_id', // Foreign key on the attendances table...
            'attendance_id', // Foreign key on the overtime_records table...
            'employee_id', // Local key on payrolls table...
            'id' // Local key on attendances table...
        )->whereBetween('attendances.date', [$this->start_date, $this->end_date]);
    }

    /**
     * Calculate and update payroll totals.
     *
     * @return $this
     */
    public function calculateTotals()
    {
        // Calculate total earnings
        $this->gross_pay = $this->regular_earnings +
            $this->overtime_earnings +
            $this->holiday_pay +
            $this->allowances +
            $this->other_earnings;

        // Calculate total deductions
        $this->total_deductions = $this->sss_contribution +
            $this->philhealth_contribution +
            $this->pagibig_contribution +
            $this->tax_withheld +
            $this->loan_deductions +
            $this->other_deductions;

        // Calculate net pay
        $this->net_pay = $this->gross_pay - $this->total_deductions;

        return $this;
    }

    /**
     * Process the payroll based on attendance and salary information.
     *
     * @return $this
     */
    public function process()
    {
        if ($this->status !== 'draft') {
            return $this;
        }

        $employee = $this->employee;
        $salary = $employee->currentSalary;
        $deductionSetting = DeductionSetting::where('employee_id', $this->employee_id)
            ->where('is_active', true)
            ->first();

        if (!$salary) {
            return $this;
        }

        // Set basic salary
        $this->basic_salary = $salary->monthly_rate;

        // Calculate days worked and earnings
        $attendances = $this->attendances()->get();
        $this->days_worked = $attendances->sum('days_worked');
        $this->regular_earnings = $this->days_worked * $salary->daily_rate;

        // Process overtime
        $overtimeRecords = $this->overtimeRecords()->get();
        $this->overtime_hours = $overtimeRecords->sum('hours');
        $this->overtime_earnings = $overtimeRecords->sum(function ($record) use ($salary) {
            return $record->hours * $salary->hourly_rate * $record->rate_multiplier;
        });

        // Store details as JSON
        $this->attendance_details = $attendances->toArray();
        $this->overtime_details = $overtimeRecords->toArray();

        // Process deductions if settings exist
        if ($deductionSetting) {
            $this->sss_contribution = $deductionSetting->sss_contribution;
            $this->philhealth_contribution = $deductionSetting->philhealth_contribution;
            $this->pagibig_contribution = $deductionSetting->pagibig_contribution;
            $this->tax_withheld = $deductionSetting->calculateEstimatedTax($this->gross_pay);
            $this->allowances = $deductionSetting->allowances;

            // Process loans if any
            if (!empty($deductionSetting->loans)) {
                $this->loan_deductions = collect($deductionSetting->loans)->sum('amount');
                $this->deduction_details = [
                    'loans' => $deductionSetting->loans,
                    'other' => $deductionSetting->other_deductions
                ];
            }
        }

        // Calculate final totals
        $this->calculateTotals();

        // Update status
        $this->status = 'processing';

        return $this;
    }

    /**
     * Approve the payroll.
     *
     * @return $this
     */
    public function approve()
    {
        if ($this->status === 'processing') {
            $this->status = 'approved';
            $this->save();
        }

        return $this;
    }

    /**
     * Mark the payroll as paid.
     *
     * @param string|null $notes
     * @return $this
     */
    public function markAsPaid($notes = null)
    {
        if ($this->status === 'approved') {
            $this->status = 'paid';

            if ($notes) {
                $this->remarks = $notes;
            }

            $this->save();
        }

        return $this;
    }

    /**
     * Scope a query to only include payrolls for a specific status.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}