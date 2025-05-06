import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PayrollGenerate({ employees = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        period_type: 'Semi-Monthly',
        start_date: '',
        end_date: '',
        payment_date: '',
        description: '',
        selected_employees: [],
    });
    
    const [payrollEmployees, setPayrollEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    
    // Initialize employee selections
    useEffect(() => {
        if (employees.length > 0) {
            const initialEmployees = employees.map(employee => {
                const basicPay = calculateBasicPay(employee.basic_salary, employee.salary_type, data.period_type);
                
                return {
                    id: employee.id,
                    employee_id: employee.employee_id,
                    name: `${employee.last_name}, ${employee.first_name} ${employee.middle_name || ''}`,
                    basic_salary: employee.basic_salary,
                    salary_type: employee.salary_type,
                    department: employee.department,
                    position: employee.position,
                    selected: false,
                    
                    // Earnings
                    basic_pay: basicPay,
                    
                    // Different overtime types
                    regular_overtime_hours: 0,
                    regular_overtime_pay: 0,
                    rest_day_hours: 0,
                    rest_day_pay: 0,
                    special_holiday_hours: 0,
                    special_holiday_pay: 0,
                    special_holiday_rest_day_hours: 0,
                    special_holiday_rest_day_pay: 0,
                    legal_holiday_hours: 0,
                    legal_holiday_pay: 0,
                    night_differential_hours: 0,
                    night_differential_pay: 0,
                    
                    // Total overtime pay (sum of all types)
                    overtime_hours: 0,
                    overtime_pay: 0,
                    
                    allowances: 0,
                    other_earnings: 0,
                    
                    // Days worked and absences
                    days_worked: data.period_type === 'Monthly' ? 22 : 
                               data.period_type === 'Semi-Monthly' ? 11 : 
                               data.period_type === 'Weekly' ? 5 : 
                               data.period_type === 'Bi-Weekly' ? 10 : 22,
                    absences: 0,
                    
                    // Deductions
                    sss_contribution: 0,
                    philhealth_contribution: 0,
                    pagibig_contribution: 100, // Default monthly Pag-IBIG contribution
                    withholding_tax: 0,
                    sss_loan: 0,
                    pagibig_loan: 0,
                    other_deductions: 0,
                    
                    // Calculated fields
                    gross_pay: basicPay,
                    total_deductions: 100, // Initial with Pag-IBIG only
                    net_pay: basicPay - 100
                };
            });
            
            setPayrollEmployees(initialEmployees);
        }
    }, [employees, data.period_type]);
    
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        
        const updatedEmployees = payrollEmployees.map(employee => ({
            ...employee,
            selected: newSelectAll
        }));
        
        setPayrollEmployees(updatedEmployees);
        updateSelectedEmployees(updatedEmployees);
    };
    
    const handleEmployeeSelect = (employeeId) => {
        const updatedEmployees = payrollEmployees.map(employee => 
            employee.id === employeeId 
                ? { ...employee, selected: !employee.selected } 
                : employee
        );
        
        setPayrollEmployees(updatedEmployees);
        setSelectAll(updatedEmployees.every(emp => emp.selected));
        updateSelectedEmployees(updatedEmployees);
    };
    
    const updateSelectedEmployees = (employees) => {
        const selectedEmployees = employees
            .filter(emp => emp.selected)
            .map(employee => ({
                employee_id: employee.id,
                days_worked: employee.days_worked,
                absences: employee.absences,
                basic_pay: employee.basic_pay,
                overtime_pay: employee.overtime_pay,
                // Include all overtime types
                regular_overtime_hours: employee.regular_overtime_hours,
                regular_overtime_pay: employee.regular_overtime_pay,
                rest_day_hours: employee.rest_day_hours,
                rest_day_pay: employee.rest_day_pay,
                special_holiday_hours: employee.special_holiday_hours,
                special_holiday_pay: employee.special_holiday_pay,
                special_holiday_rest_day_hours: employee.special_holiday_rest_day_hours,
                special_holiday_rest_day_pay: employee.special_holiday_rest_day_pay,
                legal_holiday_hours: employee.legal_holiday_hours,
                legal_holiday_pay: employee.legal_holiday_pay,
                night_differential_hours: employee.night_differential_hours,
                night_differential_pay: employee.night_differential_pay,
                allowances: employee.allowances,
                other_earnings: employee.other_earnings,
                sss_contribution: employee.sss_contribution,
                philhealth_contribution: employee.philhealth_contribution,
                pagibig_contribution: employee.pagibig_contribution,
                withholding_tax: employee.withholding_tax,
                sss_loan: employee.sss_loan,
                pagibig_loan: employee.pagibig_loan,
                other_deductions: employee.other_deductions,
                gross_pay: employee.gross_pay,
                total_deductions: employee.total_deductions,
                net_pay: employee.net_pay
            }));
        
        setData('selected_employees', selectedEmployees);
    };
    
    const handleHoursChange = (employeeId, field, value) => {
        const numValue = parseFloat(value) || 0;
        
        const updatedEmployees = payrollEmployees.map(employee => {
            if (employee.id !== employeeId) return employee;
            
            const updatedEmployee = { ...employee };
            updatedEmployee[field] = numValue;
            
            // Get the hourly rate for this employee
            const hourlyRate = calculateHourlyRate(employee.basic_salary, employee.salary_type);
            
            // Handle different overtime types
            if (field === 'regular_overtime_hours') {
                updatedEmployee.regular_overtime_pay = calculateOvertimePay(numValue, hourlyRate, 'regular_overtime');
            } else if (field === 'rest_day_hours') {
                updatedEmployee.rest_day_pay = calculateOvertimePay(numValue, hourlyRate, 'rest_day');
            } else if (field === 'special_holiday_hours') {
                updatedEmployee.special_holiday_pay = calculateOvertimePay(numValue, hourlyRate, 'special_holiday');
            } else if (field === 'special_holiday_rest_day_hours') {
                updatedEmployee.special_holiday_rest_day_pay = calculateOvertimePay(numValue, hourlyRate, 'special_holiday_rest_day');
            } else if (field === 'legal_holiday_hours') {
                updatedEmployee.legal_holiday_pay = calculateOvertimePay(numValue, hourlyRate, 'legal_holiday');
            } else if (field === 'night_differential_hours') {
                updatedEmployee.night_differential_pay = calculateOvertimePay(numValue, hourlyRate, 'night_differential');
            } else if (field === 'overtime_hours') {
                // For backward compatibility with the old single overtime field
                updatedEmployee.overtime_pay = calculateOvertimePay(numValue, hourlyRate, 'regular_overtime');
            }
            
            // Calculate total overtime hours and pay
            updatedEmployee.overtime_hours = 
                parseFloat(updatedEmployee.regular_overtime_hours || 0) +
                parseFloat(updatedEmployee.rest_day_hours || 0) +
                parseFloat(updatedEmployee.special_holiday_hours || 0) +
                parseFloat(updatedEmployee.special_holiday_rest_day_hours || 0) +
                parseFloat(updatedEmployee.legal_holiday_hours || 0) +
                parseFloat(updatedEmployee.night_differential_hours || 0);
            
            // Adjust basic pay based on days worked and absences if those fields changed
            if (field === 'days_worked' || field === 'absences') {
                updatedEmployee.basic_pay = adjustBasicPayForAttendance(
                    employee.basic_salary, 
                    employee.salary_type,
                    data.period_type,
                    updatedEmployee.days_worked,
                    updatedEmployee.absences
                );
            }
            
            // Recalculate totals
            updatedEmployee.gross_pay = calculateGrossPay(updatedEmployee);
            
            // Calculate mandatory contributions based on gross pay
            updatedEmployee.sss_contribution = calculateSSSContribution(updatedEmployee.gross_pay);
            updatedEmployee.philhealth_contribution = calculatePhilHealthContribution(updatedEmployee.gross_pay);
            
            // Calculate withholding tax after mandatory contributions
            updatedEmployee.withholding_tax = calculateWithholdingTax(
                updatedEmployee.gross_pay,
                updatedEmployee.sss_contribution,
                updatedEmployee.philhealth_contribution,
                updatedEmployee.pagibig_contribution
            );
            
            // Calculate total deductions and net pay
            updatedEmployee.total_deductions = calculateTotalDeductions(updatedEmployee);
            updatedEmployee.net_pay = updatedEmployee.gross_pay - updatedEmployee.total_deductions;
            
            return updatedEmployee;
        });
        
        setPayrollEmployees(updatedEmployees);
        updateSelectedEmployees(updatedEmployees);
    };
    
    const handleValueChange = (employeeId, field, value) => {
        const numValue = parseFloat(value) || 0;
        
        const updatedEmployees = payrollEmployees.map(employee => {
            if (employee.id !== employeeId) return employee;
            
            const updatedEmployee = { ...employee };
            updatedEmployee[field] = numValue;
            
            // Recalculate totals
            updatedEmployee.gross_pay = calculateGrossPay(updatedEmployee);
            updatedEmployee.total_deductions = calculateTotalDeductions(updatedEmployee);
            updatedEmployee.net_pay = updatedEmployee.gross_pay - updatedEmployee.total_deductions;
            
            return updatedEmployee;
        });
        
        setPayrollEmployees(updatedEmployees);
        updateSelectedEmployees(updatedEmployees);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payroll.store'));
    };
    
    // Helper functions for Philippine payroll calculations
    function calculateBasicPay(basicSalary, salaryType, periodType) {
        const salary = parseFloat(basicSalary) || 0;
        
        switch(salaryType) {
            case 'Monthly':
                if (periodType === 'Monthly') return salary;
                if (periodType === 'Semi-Monthly') return salary / 2;
                if (periodType === 'Weekly') return (salary * 12) / 52;
                if (periodType === 'Bi-Weekly') return (salary * 12) / 26;
                return salary;
                
            case 'Semi-Monthly':
                if (periodType === 'Monthly') return salary * 2;
                if (periodType === 'Semi-Monthly') return salary;
                if (periodType === 'Weekly') return (salary * 24) / 52;
                if (periodType === 'Bi-Weekly') return (salary * 24) / 26;
                return salary;
                
            case 'Daily':
                // Assuming 22 working days per month
                if (periodType === 'Monthly') return salary * 22;
                if (periodType === 'Semi-Monthly') return salary * 11;
                if (periodType === 'Weekly') return salary * 5;
                if (periodType === 'Bi-Weekly') return salary * 10;
                return salary;
                
            default:
                return salary;
        }
    }
    
    function calculateHourlyRate(basicSalary, salaryType) {
        const salary = parseFloat(basicSalary) || 0;
        
        switch(salaryType) {
            case 'Monthly':
                // Assuming 22 working days per month and 8 hours per day
                return salary / (22 * 8);
                
            case 'Semi-Monthly':
                // Assuming 11 working days per half-month and 8 hours per day
                return salary / (11 * 8);
                
            case 'Daily':
                // Assuming 8 hours per day
                return salary / 8;
                
            case 'Hourly':
                return salary;
                
            default:
                return salary / (22 * 8);
        }
    }
    
    // New function to calculate overtime pay based on type
    function calculateOvertimePay(overtimeHours, hourlyRate, overtimeType) {
        // Rate multipliers as per Philippine Labor Code
        const multipliers = {
            'regular_overtime': 1.25, // 25% premium
            'rest_day': 1.30, // 30% premium
            'special_holiday': 1.30, // 30% premium
            'special_holiday_rest_day': 1.50, // 50% premium
            'legal_holiday': 2.00, // 100% premium (double pay)
            'night_differential': 1.10, // 10% premium
        };
        
        const rateMultiplier = multipliers[overtimeType] || 1.25; // Default to regular OT if type not found
        return overtimeHours * hourlyRate * rateMultiplier;
    }
    
    function calculateGrossPay(employee) {
        // Calculate total overtime pay as sum of all overtime types
        const totalOvertimePay = 
            parseFloat(employee.regular_overtime_pay || 0) +
            parseFloat(employee.rest_day_pay || 0) +
            parseFloat(employee.special_holiday_pay || 0) +
            parseFloat(employee.special_holiday_rest_day_pay || 0) +
            parseFloat(employee.legal_holiday_pay || 0) +
            parseFloat(employee.night_differential_pay || 0);
        
        return parseFloat(employee.basic_pay || 0) + 
               totalOvertimePay + 
               parseFloat(employee.allowances || 0) + 
               parseFloat(employee.other_earnings || 0);
    }
    
    function calculateTotalDeductions(employee) {
        return parseFloat(employee.sss_contribution || 0) + 
               parseFloat(employee.philhealth_contribution || 0) + 
               parseFloat(employee.pagibig_contribution || 0) + 
               parseFloat(employee.withholding_tax || 0) + 
               parseFloat(employee.sss_loan || 0) + 
               parseFloat(employee.pagibig_loan || 0) + 
               parseFloat(employee.other_deductions || 0);
    }
    
    function calculateSSSContribution(monthlyGrossPay) {
        // Convert to monthly equivalent for calculation
        let monthlyPay = monthlyGrossPay;
        if (data.period_type === 'Semi-Monthly') monthlyPay *= 2;
        if (data.period_type === 'Weekly') monthlyPay *= 4.33;
        if (data.period_type === 'Bi-Weekly') monthlyPay *= 2.17;
        
        // 2023 SSS Contribution Table (simplified)
        if (monthlyPay <= 4249.99) return 180;
        if (monthlyPay <= 4749.99) return 202.50;
        if (monthlyPay <= 5249.99) return 225;
        if (monthlyPay <= 5749.99) return 247.50;
        if (monthlyPay <= 6249.99) return 270;
        if (monthlyPay <= 6749.99) return 292.50;
        if (monthlyPay <= 7249.99) return 315;
        if (monthlyPay <= 7749.99) return 337.50;
        if (monthlyPay <= 8249.99) return 360;
        if (monthlyPay <= 8749.99) return 382.50;
        if (monthlyPay <= 9249.99) return 405;
        if (monthlyPay <= 9749.99) return 427.50;
        if (monthlyPay <= 10249.99) return 450;
        if (monthlyPay <= 10749.99) return 472.50;
        if (monthlyPay <= 11249.99) return 495;
        if (monthlyPay <= 11749.99) return 517.50;
        if (monthlyPay <= 12249.99) return 540;
        if (monthlyPay <= 12749.99) return 562.50;
        if (monthlyPay <= 13249.99) return 585;
        if (monthlyPay <= 13749.99) return 607.50;
        if (monthlyPay <= 14249.99) return 630;
        if (monthlyPay <= 14749.99) return 652.50;
        if (monthlyPay <= 15249.99) return 675;
        if (monthlyPay <= 15749.99) return 697.50;
        if (monthlyPay <= 16249.99) return 720;
        if (monthlyPay <= 16749.99) return 742.50;
        if (monthlyPay <= 17249.99) return 765;
        if (monthlyPay <= 17749.99) return 787.50;
        if (monthlyPay <= 18249.99) return 810;
        if (monthlyPay <= 18749.99) return 832.50;
        if (monthlyPay <= 19249.99) return 855;
        if (monthlyPay <= 19749.99) return 877.50;
        if (monthlyPay <= 20249.99) return 900;
        if (monthlyPay <= 20749.99) return 922.50;
        if (monthlyPay <= 21249.99) return 945;
        if (monthlyPay <= 21749.99) return 967.50;
        if (monthlyPay <= 22249.99) return 990;
        if (monthlyPay <= 22749.99) return 1012.50;
        if (monthlyPay <= 23249.99) return 1035;
        if (monthlyPay <= 23749.99) return 1057.50;
        if (monthlyPay <= 24249.99) return 1080;
        if (monthlyPay <= 24749.99) return 1102.50;
        // Maximum monthly salary credit is 25,000
        return 1125;
    }
    
    function calculatePhilHealthContribution(monthlyGrossPay) {
        // Convert to monthly equivalent
        let monthlyPay = monthlyGrossPay;
        if (data.period_type === 'Semi-Monthly') monthlyPay *= 2;
        if (data.period_type === 'Weekly') monthlyPay *= 4.33;
        if (data.period_type === 'Bi-Weekly') monthlyPay *= 2.17;
        
        // 2023 PhilHealth Contribution (4% of monthly basic salary)
        let contribution = 0;
        
        if (monthlyPay <= 10000) {
            contribution = 400; // Minimum monthly premium of ₱400
        } else if (monthlyPay >= 80000) {
            contribution = 3200; // Maximum monthly premium of ₱3,200 (4% of ₱80,000)
        } else {
            contribution = monthlyPay * 0.04;
        }
        
        // Adjust based on period type
        if (data.period_type === 'Semi-Monthly') return contribution / 2;
        if (data.period_type === 'Weekly') return contribution / 4.33;
        if (data.period_type === 'Bi-Weekly') return contribution / 2.17;
        
        return contribution;
    }
    
    function calculateWithholdingTax(grossPay, sssContribution, philhealthContribution, pagibigContribution) {
        // Convert to monthly equivalent
        let monthlyGrossPay = grossPay;
        let monthlySSS = sssContribution;
        let monthlyPhilHealth = philhealthContribution;
        let monthlyPagibig = pagibigContribution;
        
        if (data.period_type === 'Semi-Monthly') {
            monthlyGrossPay *= 2;
            monthlySSS *= 2;
            monthlyPhilHealth *= 2;
            monthlyPagibig *= 2;
        } else if (data.period_type === 'Weekly') {
            monthlyGrossPay *= 4.33;
            monthlySSS *= 4.33;
            monthlyPhilHealth *= 4.33;
            monthlyPagibig *= 4.33;
        } else if (data.period_type === 'Bi-Weekly') {
            monthlyGrossPay *= 2.17;
            monthlySSS *= 2.17;
            monthlyPhilHealth *= 2.17;
            monthlyPagibig *= 2.17;
        }
        
        // Calculate taxable income
        const totalContributions = monthlySSS + monthlyPhilHealth + monthlyPagibig;
        const taxableIncome = monthlyGrossPay - totalContributions;
        
        // 2023 Withholding Tax Table
        let tax = 0;
        
        if (taxableIncome <= 20833) {
            tax = 0;
        } else if (taxableIncome <= 33332) {
            tax = (taxableIncome - 20833) * 0.15;
        } else if (taxableIncome <= 66666) {
            tax = 1875 + (taxableIncome - 33333) * 0.2;
        } else if (taxableIncome <= 166666) {
            tax = 8541.80 + (taxableIncome - 66667) * 0.25;
        } else if (taxableIncome <= 666666) {
            tax = 33541.80 + (taxableIncome - 166667) * 0.3;
        } else {
            tax = 183541.80 + (taxableIncome - 666667) * 0.35;
        }
        
        // Adjust tax based on period type
        if (data.period_type === 'Semi-Monthly') return tax / 2;
        if (data.period_type === 'Weekly') return tax / 4.33;
        if (data.period_type === 'Bi-Weekly') return tax / 2.17;
        
        return tax;
    }

    // New function to adjust basic pay based on attendance
    function adjustBasicPayForAttendance(basicSalary, salaryType, periodType, daysWorked, absences) {
        const fullPeriodPay = calculateBasicPay(basicSalary, salaryType, periodType);
        
        // Determine total expected days for the period
        let expectedDays;
        switch(periodType) {
            case 'Monthly': expectedDays = 22; break;
            case 'Semi-Monthly': expectedDays = 11; break;
            case 'Weekly': expectedDays = 5; break;
            case 'Bi-Weekly': expectedDays = 10; break;
            default: expectedDays = 22;
        }
        
        // Adjust for actual days worked and absences
        const actualDays = Math.max(0, daysWorked - absences);
        const attendanceRatio = actualDays / expectedDays;
        
        return fullPeriodPay * attendanceRatio;
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Generate Payroll
                </h2>
            }
        >
            <Head title="Generate Payroll" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-medium">Payroll Information</h3>
                            
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <InputLabel htmlFor="period_type" value="Period Type" />
                                    <select
                                        id="period_type"
                                        name="period_type"
                                        value={data.period_type}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('period_type', e.target.value)}
                                        required
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Semi-Monthly">Semi-Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                    </select>
                                    <InputError message={errors.period_type} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="start_date" value="Start Date" />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        value={data.start_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="end_date" value="End Date" />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        name="end_date"
                                        value={data.end_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="payment_date" value="Payment Date" />
                                    <TextInput
                                        id="payment_date"
                                        type="date"
                                        name="payment_date"
                                        value={data.payment_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.payment_date} className="mt-2" />
                                </div>
                                
                                <div className="md:col-span-3">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextInput
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Employee Table */}
                        <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Employee
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Days Worked
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Absences
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Basic Pay
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Regular OT
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Rest Day OT
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Special Holiday
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Spec. Holiday Rest Day
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Legal Holiday
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Night Diff.
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Allowances
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                SSS
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                PhilHealth
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Pag-IBIG
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tax
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Net Pay
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {payrollEmployees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={employee.selected}
                                                        onChange={() => handleEmployeeSelect(employee.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <div className="font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-xs text-gray-500">{employee.position}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.days_worked}
                                                        onChange={(e) => handleHoursChange(employee.id, 'days_worked', e.target.value)}
                                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.absences}
                                                        onChange={(e) => handleHoursChange(employee.id, 'absences', e.target.value)}
                                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    ₱{employee.basic_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.regular_overtime_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'regular_overtime_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Regular Overtime Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.regular_overtime_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.rest_day_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'rest_day_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Rest Day Overtime Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.rest_day_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.special_holiday_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'special_holiday_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Special Holiday Overtime Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.special_holiday_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.special_holiday_rest_day_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'special_holiday_rest_day_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Special Holiday Rest Day Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.special_holiday_rest_day_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.legal_holiday_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'legal_holiday_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Legal Holiday Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.legal_holiday_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.5"
                                                        value={employee.night_differential_hours}
                                                        onChange={(e) => handleHoursChange(employee.id, 'night_differential_hours', e.target.value)}
                                                        className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                        title="Night Differential Hours"
                                                    />
                                                    <div className="mt-1 text-xs">
                                                        ₱{employee.night_differential_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.01"
                                                        value={employee.allowances}
                                                        onChange={(e) => handleValueChange(employee.id, 'allowances', e.target.value)}
                                                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={!employee.selected}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    ₱{employee.sss_contribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    ₱{employee.philhealth_contribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    ₱{employee.pagibig_contribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    ₱{employee.withholding_tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    ₱{employee.net_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={route('payroll.index')}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton disabled={processing}>Generate Payroll</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 