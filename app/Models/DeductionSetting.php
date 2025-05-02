<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeductionSetting extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'sss_contribution',
        'philhealth_contribution',
        'pagibig_contribution',
        'tax_rate',
        'tax_exemption',
        'tax_status',
        'loans',
        'other_deductions',
        'allowances',
        'allowance_details',
        'other_additions',
        'addition_details',
        'effective_date',
        'end_date',
        'is_active',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sss_contribution' => 'decimal:2',
        'philhealth_contribution' => 'decimal:2',
        'pagibig_contribution' => 'decimal:2',
        'tax_rate' => 'decimal:4',
        'tax_exemption' => 'decimal:2',
        'loans' => 'array',
        'other_deductions' => 'array',
        'allowances' => 'decimal:2',
        'allowance_details' => 'array',
        'other_additions' => 'decimal:2',
        'addition_details' => 'array',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the employee that owns the deduction setting.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Calculate total government contributions.
     *
     * @return float
     */
    public function getTotalGovernmentContributionsAttribute()
    {
        return $this->sss_contribution +
            $this->philhealth_contribution +
            $this->pagibig_contribution;
    }

    /**
     * Calculate estimated tax based on rate and exemption.
     *
     * @param float $income
     * @return float
     */
    public function calculateEstimatedTax($income)
    {
        $taxableIncome = max(0, $income - $this->tax_exemption);
        return $taxableIncome * $this->tax_rate;
    }

    /**
     * Scope a query to only include active deduction settings.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to find settings effective on a given date.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $date
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEffectiveOn($query, $date)
    {
        return $query->where('effective_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->where('end_date', '>=', $date)
                    ->orWhereNull('end_date');
            });
    }
}