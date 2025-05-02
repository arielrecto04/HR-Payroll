<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'birth_date',
        'gender',
        'civil_status',
        'nationality',
        'address',
        'contact_number',
        'email',
        'emergency_contact_name',
        'emergency_contact_number',
        'tin_number',
        'sss_number',
        'philhealth_number',
        'pagibig_number',
        'date_hired',
        'employment_status',
        'department',
        'position',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date:Y-m-d',
        'date_hired' => 'date:Y-m-d',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['full_name', 'basic_salary', 'salary_type'];

    /**
     * Get the date format for storage.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d';

    /**
     * Get full name attribute
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} " . ($this->middle_name ? "{$this->middle_name} " : '') . "{$this->last_name}" . ($this->suffix ? ", {$this->suffix}" : '');
    }

    /**
     * Get the employee's basic salary from their current salary record
     *
     * @return string|null
     */
    public function getBasicSalaryAttribute()
    {
        $currentSalary = $this->currentSalary;

        if ($currentSalary) {
            $salaryType = $currentSalary->salary_type;

            if ($salaryType === 'Monthly') {
                return $currentSalary->monthly_rate;
            } elseif ($salaryType === 'Semi-Monthly') {
                return $currentSalary->semi_monthly_rate;
            } elseif ($salaryType === 'Daily') {
                return $currentSalary->daily_rate;
            } elseif ($salaryType === 'Hourly') {
                return $currentSalary->hourly_rate;
            } elseif ($salaryType === 'Weekly') {
                // Weekly rate would be daily rate * 5
                return $currentSalary->daily_rate * 5;
            }
        }

        return null;
    }

    /**
     * Get the employee's salary type from their current salary record
     *
     * @return string|null
     */
    public function getSalaryTypeAttribute()
    {
        $currentSalary = $this->currentSalary;

        return $currentSalary ? $currentSalary->salary_type : null;
    }

    /**
     * Get the salaries for the employee.
     */
    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    /**
     * Get the current active salary for the employee.
     */
    public function currentSalary()
    {
        return $this->hasOne(EmployeeSalary::class)
            ->where('is_active', true)
            ->latest('effective_date');
    }
}