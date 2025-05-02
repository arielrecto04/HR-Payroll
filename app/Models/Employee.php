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
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date',
        'date_hired' => 'date',
    ];

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