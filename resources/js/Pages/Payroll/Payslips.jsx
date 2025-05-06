import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Payslips({ payroll }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payroll Payslips
                </h2>
            }
        >
            <Head title="Payroll Payslips" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 flex justify-between items-center border-b border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900">Payslip Details</h4>
                            <div className="flex space-x-2">
                                <Link
                                    href={route('payroll.show', payroll.id)}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Back to Payroll
                                </Link>
                                <Link
                                    href={route('payroll.download-pdf', payroll.id)}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Download PDF
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-8 text-center">
                                <h3 className="text-xl font-semibold">Company Name</h3>
                                <p className="text-gray-600">Company Address</p>
                                <h4 className="text-lg font-medium mt-4 mb-2">PAYSLIP</h4>
                                <p className="text-sm">
                                    <span className="font-medium">Pay Period:</span> {payroll.payroll_period} ({formatDate(payroll.start_date)} - {formatDate(payroll.end_date)})
                                </p>
                                <p className="text-sm mb-4">
                                    <span className="font-medium">Payment Date:</span> {formatDate(payroll.payment_date)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h5 className="text-lg font-medium mb-2">Employee Information</h5>
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Employee ID:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.employee.employee_id}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Name:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.employee.last_name}, {payroll.employee.first_name} {payroll.employee.middle_name}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Position:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.employee.position}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Department:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.employee.department}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h5 className="text-lg font-medium mb-2">Attendance Summary</h5>
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Days Worked:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.days_worked}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Overtime Hours:</th>
                                                <td className="text-sm text-gray-900 py-2">{payroll.overtime_hours}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h5 className="text-lg font-medium mb-2">Earnings</h5>
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Basic Salary</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.regular_earnings)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Overtime Pay:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.overtime_earnings)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Holiday Pay:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.holiday_pay)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Allowances:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.allowances)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Other Earnings:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.other_earnings)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-900">Total Gross Pay:</th>
                                                <td className="text-right py-2 text-sm font-semibold text-gray-900">{formatCurrency(payroll.gross_pay)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h5 className="text-lg font-medium mb-2">Deductions</h5>
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">SSS Contribution:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.sss_contribution)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">PhilHealth Contribution:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.philhealth_contribution)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Pag-IBIG Contribution:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.pagibig_contribution)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Tax Withheld:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.tax_withheld)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Loan Deductions:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.loan_deductions)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Other Deductions:</th>
                                                <td className="text-right py-2 text-sm text-gray-900">{formatCurrency(payroll.other_deductions)}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left py-2 text-sm font-medium text-gray-900">Total Deductions:</th>
                                                <td className="text-right py-2 text-sm font-semibold text-gray-900">{formatCurrency(payroll.total_deductions)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end mb-6">
                                <div className="md:w-1/2">
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr>
                                                <th className="text-left py-2 text-base font-semibold text-gray-900">NET PAY:</th>
                                                <td className="text-right py-2 text-lg font-bold text-gray-900">{formatCurrency(payroll.net_pay)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {payroll.remarks && (
                                <div className="mb-6">
                                    <h5 className="text-lg font-medium mb-2">Remarks</h5>
                                    <p className="text-sm text-gray-700">{payroll.remarks}</p>
                                </div>
                            )}

                            <div className="mt-12 pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <div className="border-t border-gray-900 w-3/4 mx-auto mt-8">
                                            <p className="mt-2 text-sm">Employer's Signature</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-t border-gray-900 w-3/4 mx-auto mt-8">
                                            <p className="mt-2 text-sm">Employee's Signature</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 border-t">
                            This is an electronic payslip. No signature required.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Utility functions
const formatCurrency = (amount, currency = '₱') => {
    if (amount === null || amount === undefined) return `${currency}0.00`;
    
    return `${currency}${parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const defaultOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}; 