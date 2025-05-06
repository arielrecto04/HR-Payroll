import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PayrollIndex({ payrollRuns = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    
    // Check if payrollRuns is a paginator object with data property or an array
    const payrollData = Array.isArray(payrollRuns) ? payrollRuns : (payrollRuns.data || []);
    
    const filteredPayrollRuns = payrollData.filter(payroll => 
        (payroll.payroll_period.toLowerCase().includes(searchTerm.toLowerCase()) ||
         payroll.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (periodFilter ? payroll.period_type === periodFilter : true)
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payroll Management
                </h2>
            }
        >
            <Head title="Payroll Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Generate Payroll</h3>
                            <p className="mb-4 text-sm text-gray-500">Create a new payroll run for a specific period.</p>
                            <Link
                                href="/payroll/generate"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Generate Payroll
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mb-6 flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                            <input 
                                type="text" 
                                placeholder="Search payroll..." 
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value)}
                            >
                                <option value="">All Periods</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Semi-Monthly">Semi-Monthly</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-Weekly">Bi-Weekly</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Employee
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Gross Pay
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Net Pay
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredPayrollRuns.length > 0 ? (
                                            filteredPayrollRuns.map((payroll) => (
                                                <tr key={payroll.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                                                        <div className="flex space-x-1">
                                                            <Link
                                                                href={`/payroll/${payroll.id}/view`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </Link>
                                                            {payroll.status !== 'Finalized' && (
                                                                <Link
                                                                    href={`/payroll/${payroll.id}/edit`}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </Link>
                                                            )}
                                                            <Link
                                                                href={`/payroll/${payroll.id}/payslips`}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{payroll.employee?.name || '-'}</div>
                                                            <div className="text-xs text-gray-500">{payroll.employee?.position || ''}</div>
                                                            <div className="text-xs text-gray-500">ID: {payroll.employee?.id || '-'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        ₱{calculateGrossPay(payroll).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        ₱{calculateNetPay(payroll).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <PayrollStatus status={payroll.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                                                    No payroll records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function PayrollStatus({ status }) {
    let bgColor = "bg-gray-100 text-gray-800";
    
    switch(status) {
        case 'Draft':
            bgColor = "bg-yellow-100 text-yellow-800";
            break;
        case 'Processing':
            bgColor = "bg-blue-100 text-blue-800";
            break;
        case 'Finalized':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'Paid':
            bgColor = "bg-purple-100 text-purple-800";
            break;
        default:
            bgColor = "bg-gray-100 text-gray-800";
    }
    
    return (
        <span className={`inline-flex rounded-full ${bgColor} px-2 text-xs font-semibold leading-5`}>
            {status}
        </span>
    );
}

function calculateGrossPay(payroll) {
    // Basic salary calculation
    const basicSalary = payroll.employee_salary?.semi_monthly_rate || 0;
    
    // Overtime and other additions
    const overtimeEarnings = 
        (payroll.overtime_details?.regular_overtime || 0) + 
        (payroll.overtime_details?.rest_day || 0) + 
        (payroll.overtime_details?.special_holiday || 0) + 
        (payroll.overtime_details?.special_holiday_rest_day || 0) + 
        (payroll.overtime_details?.legal_holiday || 0) + 
        (payroll.overtime_details?.night_differential || 0);
    
    // Allowances and other earnings
    const additions = (payroll.allowances || 0) + (payroll.other_earnings || 0);
    
    return basicSalary + overtimeEarnings + additions;
}

function calculateNetPay(payroll) {
    const grossPay = calculateGrossPay(payroll);
    
    // Statutory deductions
    const statutoryDeductions = 
        (payroll.sss_contribution || 0) + 
        (payroll.philhealth_contribution || 0) + 
        (payroll.pagibig_contribution || 0) + 
        (payroll.tax_withheld || 0);
    
    // Other deductions
    const otherDeductions = (payroll.loan_deductions || 0) + (payroll.other_deductions || 0);
    
    return grossPay - statutoryDeductions - otherDeductions;
} 