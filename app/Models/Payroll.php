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
        'monthly_salary',
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
        'monthly_salary' => 'decimal:2',
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
     * Get the employee's current salary.
     */
    public function employeeSalary()
    {
        return $this->belongsTo(EmployeeSalary::class, 'employee_id', 'employee_id')
            ->where('is_active', true);
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
        // Set defaults for any null values
        $this->regular_earnings = $this->regular_earnings ?? 0;
        $this->overtime_earnings = $this->overtime_earnings ?? 0;
        $this->holiday_pay = $this->holiday_pay ?? 0;
        $this->allowances = $this->allowances ?? 0;
        $this->other_earnings = $this->other_earnings ?? 0;
        $this->sss_contribution = $this->sss_contribution ?? 0;
        $this->philhealth_contribution = $this->philhealth_contribution ?? 0;
        $this->pagibig_contribution = $this->pagibig_contribution ?? 0;
        $this->tax_withheld = $this->tax_withheld ?? 0;
        $this->loan_deductions = $this->loan_deductions ?? 0;
        $this->other_deductions = $this->other_deductions ?? 0;

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
        try {
            \Log::info('Processing payroll ID: ' . $this->id);

            if ($this->status !== 'draft') {
                \Log::warning('Cannot process payroll that is not in draft status: ' . $this->status);
                return $this;
            }

            // Get the employee relationship
            $employee = $this->employee;
            if (!$employee) {
                \Log::error('Employee not found for payroll ID: ' . $this->id);
                throw new \Exception('Employee not found for payroll ID: ' . $this->id);
            }
            \Log::info('Found employee: ' . $employee->id);

            // Get the employee's current salary
            $salary = $this->employeeSalary;
            if (!$salary) {
                \Log::warning('No salary record found for employee ID: ' . $employee->id);
                // Continue processing with default values instead of returning
                $this->monthly_salary = 0;
            } else {
                // Set monthly salary
                $this->monthly_salary = $salary->monthly_rate ?? 0;
                \Log::info('Set monthly salary: ' . $this->monthly_salary);
            }

            $deductionSetting = DeductionSetting::where('employee_id', $this->employee_id)
                ->where('is_active', true)
                ->first();

            // Calculate days worked and earnings if employee has a salary
            if ($salary) {
                // Get attendance records
                $attendances = $this->attendances()->get();
                $this->days_worked = $attendances->sum('days_worked') ?: 0;
                $this->regular_earnings = $this->days_worked * ($salary->daily_rate ?? 0);
                \Log::info('Days worked: ' . $this->days_worked . ', Regular earnings: ' . $this->regular_earnings);

                // Process overtime
                $overtimeRecords = $this->overtimeRecords()->get();
                $this->overtime_hours = $overtimeRecords->sum('hours') ?: 0;
                $this->overtime_earnings = $overtimeRecords->sum(function ($record) use ($salary) {
                    return $record->hours * ($salary->hourly_rate ?? 0) * ($record->rate_multiplier ?? 1);
                });
                \Log::info('Overtime hours: ' . $this->overtime_hours . ', Overtime earnings: ' . $this->overtime_earnings);

                // Store details as JSON
                $this->attendance_details = $attendances->toArray();
                $this->overtime_details = $overtimeRecords->toArray();
            }

            // Process deductions if settings exist
            if ($deductionSetting) {
                \Log::info('Processing deductions for employee ID: ' . $this->employee_id);
                $this->sss_contribution = $deductionSetting->sss_contribution ?? 0;
                $this->philhealth_contribution = $deductionSetting->philhealth_contribution ?? 0;
                $this->pagibig_contribution = $deductionSetting->pagibig_contribution ?? 0;

                // Calculate estimated tax based on gross pay
                $grossPayForTax = $this->regular_earnings + $this->overtime_earnings + ($this->allowances ?? 0);
                $this->tax_withheld = $deductionSetting->calculateEstimatedTax ?
                    $deductionSetting->calculateEstimatedTax($grossPayForTax) : 0;

                $this->allowances = $deductionSetting->allowances ?? 0;

                // Process loans if any
                if (!empty($deductionSetting->loans)) {
                    $this->loan_deductions = collect($deductionSetting->loans)->sum('amount');
                    $this->deduction_details = [
                        'loans' => $deductionSetting->loans,
                        'other' => $deductionSetting->other_deductions
                    ];
                }
            } else {
                \Log::warning('No deduction settings found for employee ID: ' . $this->employee_id);
            }

            // Calculate final totals
            $this->calculateTotals();
            \Log::info('Calculated totals - Gross pay: ' . $this->gross_pay . ', Net pay: ' . $this->net_pay);

            // Update status
            $this->status = 'processing';
            \Log::info('Payroll processing completed for ID: ' . $this->id);

            return $this;
        } catch (\Exception $e) {
            \Log::error('Error processing payroll: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            throw $e; // Re-throw to be caught by the controller
        }
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