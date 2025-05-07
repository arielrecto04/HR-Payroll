import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';

export default function EditPayroll({ payroll, employees }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        employee_id: payroll.employee_id || '',
        payroll_period: payroll.payroll_period || '',
        start_date: payroll.start_date || '',
        end_date: payroll.end_date || '',
        payment_date: payroll.payment_date || '',
        regular_earnings: payroll.regular_earnings || 0,
        overtime_earnings: payroll.overtime_earnings || 0,
        holiday_pay: payroll.holiday_pay || 0,
        allowances: payroll.allowances || 0,
        other_earnings: payroll.other_earnings || 0,
        sss_contribution: payroll.sss_contribution || 0,
        philhealth_contribution: payroll.philhealth_contribution || 0,
        pagibig_contribution: payroll.pagibig_contribution || 0,
        tax_withheld: payroll.tax_withheld || 0,
        loan_deductions: payroll.loan_deductions || 0,
        other_deductions: payroll.other_deductions || 0,
        days_worked: payroll.days_worked || 0,
        overtime_hours: payroll.overtime_hours || 0,
        remarks: payroll.remarks || '',
    });

    const [calculatedData, setCalculatedData] = useState({
        gross_pay: payroll.gross_pay || 0,
        total_deductions: payroll.total_deductions || 0,
        net_pay: payroll.net_pay || 0,
    });

    // Calculate totals whenever relevant fields change
    const calculateTotals = () => {
        const grossPay = Number(data.regular_earnings) +
            Number(data.overtime_earnings) +
            Number(data.holiday_pay) +
            Number(data.allowances) +
            Number(data.other_earnings);

        const totalDeductions = Number(data.sss_contribution) +
            Number(data.philhealth_contribution) +
            Number(data.pagibig_contribution) +
            Number(data.tax_withheld) +
            Number(data.loan_deductions) +
            Number(data.other_deductions);

        const netPay = grossPay - totalDeductions;

        setCalculatedData({
            gross_pay: grossPay,
            total_deductions: totalDeductions,
            net_pay: netPay
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        
        // Recalculate totals on relevant field changes
        if ([
            'regular_earnings', 'overtime_earnings', 'holiday_pay', 'allowances', 'other_earnings',
            'sss_contribution', 'philhealth_contribution', 'pagibig_contribution', 'tax_withheld',
            'loan_deductions', 'other_deductions'
        ].includes(name)) {
            setTimeout(calculateTotals, 0);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Include calculated values in the submission
        const formData = {
            ...data,
            gross_pay: calculatedData.gross_pay,
            total_deductions: calculatedData.total_deductions,
            net_pay: calculatedData.net_pay,
        };
        
        put(route('payroll.update', payroll.id), formData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Payroll
                </h2>
            }
        >
            <Head title="Edit Payroll" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Employee Information */}
                                <div className="border-b border-gray-200 pb-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Employee Information</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="employee_id" value="Employee" />
                                            <SelectInput
                                                id="employee_id"
                                                name="employee_id"
                                                value={data.employee_id}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full"
                                                disabled={true} // Cannot change employee in edit mode
                                            >
                                                <option value="">Select Employee</option>
                                                {employees && employees.map(employee => (
                                                    <option key={employee.id} value={employee.id}>
                                                        {employee.last_name}, {employee.first_name} - {employee.employee_id}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.employee_id} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Payroll Period */}
                                <div className="border-b border-gray-200 pb-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Payroll Period</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="payroll_period" value="Payroll Period" />
                                            <TextInput
                                                id="payroll_period"
                                                name="payroll_period"
                                                value={data.payroll_period}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.payroll_period} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="payment_date" value="Payment Date" />
                                            <TextInput
                                                id="payment_date"
                                                name="payment_date"
                                                type="date"
                                                value={data.payment_date}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.payment_date} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="start_date" value="Start Date" />
                                            <TextInput
                                                id="start_date"
                                                name="start_date"
                                                type="date"
                                                value={data.start_date}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.start_date} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="end_date" value="End Date" />
                                            <TextInput
                                                id="end_date"
                                                name="end_date"
                                                type="date"
                                                value={data.end_date}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.end_date} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Attendance */}
                                <div className="border-b border-gray-200 pb-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Attendance</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="days_worked" value="Days Worked" />
                                            <TextInput
                                                id="days_worked"
                                                name="days_worked"
                                                type="number"
                                                step="0.5"
                                                value={data.days_worked}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.days_worked} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="absences" value="Absences" />
                                            <TextInput
                                                id="absences"
                                                name="absences"
                                                type="number"
                                                step="0.5"
                                                value={data.absences}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.absences} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="overtime_hours" value="Overtime Hours" />
                                            <TextInput
                                                id="overtime_hours"
                                                name="overtime_hours"
                                                type="number"
                                                step="0.01"
                                                value={data.overtime_hours}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.overtime_hours} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Earnings */}
                                <div className="border-b border-gray-200 pb-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Earnings</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="regular_earnings" value="Regular Earnings" />
                                            <TextInput
                                                id="regular_earnings"
                                                name="regular_earnings"
                                                type="number"
                                                step="0.01"
                                                value={data.regular_earnings}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.regular_earnings} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="overtime_earnings" value="Overtime Earnings" />
                                            <TextInput
                                                id="overtime_earnings"
                                                name="overtime_earnings"
                                                type="number"
                                                step="0.01"
                                                value={data.overtime_earnings}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.overtime_earnings} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="holiday_pay" value="Holiday Pay" />
                                            <TextInput
                                                id="holiday_pay"
                                                name="holiday_pay"
                                                type="number"
                                                step="0.01"
                                                value={data.holiday_pay}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.holiday_pay} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="allowances" value="Allowances" />
                                            <TextInput
                                                id="allowances"
                                                name="allowances"
                                                type="number"
                                                step="0.01"
                                                value={data.allowances}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.allowances} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="other_earnings" value="Other Earnings" />
                                            <TextInput
                                                id="other_earnings"
                                                name="other_earnings"
                                                type="number"
                                                step="0.01"
                                                value={data.other_earnings}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.other_earnings} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="gross_pay" value="Gross Pay" />
                                            <TextInput
                                                id="gross_pay"
                                                type="number"
                                                step="0.01"
                                                value={calculatedData.gross_pay}
                                                className="mt-1 block w-full bg-gray-100"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="border-b border-gray-200 pb-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Deductions</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="sss_contribution" value="SSS Contribution" />
                                            <TextInput
                                                id="sss_contribution"
                                                name="sss_contribution"
                                                type="number"
                                                step="0.01"
                                                value={data.sss_contribution}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.sss_contribution} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="philhealth_contribution" value="PhilHealth Contribution" />
                                            <TextInput
                                                id="philhealth_contribution"
                                                name="philhealth_contribution"
                                                type="number"
                                                step="0.01"
                                                value={data.philhealth_contribution}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.philhealth_contribution} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="pagibig_contribution" value="Pag-IBIG Contribution" />
                                            <TextInput
                                                id="pagibig_contribution"
                                                name="pagibig_contribution"
                                                type="number"
                                                step="0.01"
                                                value={data.pagibig_contribution}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.pagibig_contribution} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="tax_withheld" value="Tax Withheld" />
                                            <TextInput
                                                id="tax_withheld"
                                                name="tax_withheld"
                                                type="number"
                                                step="0.01"
                                                value={data.tax_withheld}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.tax_withheld} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="loan_deductions" value="Loan Deductions" />
                                            <TextInput
                                                id="loan_deductions"
                                                name="loan_deductions"
                                                type="number"
                                                step="0.01"
                                                value={data.loan_deductions}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.loan_deductions} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="other_deductions" value="Other Deductions" />
                                            <TextInput
                                                id="other_deductions"
                                                name="other_deductions"
                                                type="number"
                                                step="0.01"
                                                value={data.other_deductions}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.other_deductions} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="total_deductions" value="Total Deductions" />
                                            <TextInput
                                                id="total_deductions"
                                                type="number"
                                                step="0.01"
                                                value={calculatedData.total_deductions}
                                                className="mt-1 block w-full bg-gray-100"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Net Pay and Remarks */}
                                <div className="border-b border-gray-200 pb-5">
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <InputLabel htmlFor="net_pay" value="Net Pay" className="font-bold text-indigo-700" />
                                            <TextInput
                                                id="net_pay"
                                                type="number"
                                                step="0.01"
                                                value={calculatedData.net_pay}
                                                className="mt-1 block w-full bg-indigo-50 font-bold text-indigo-700"
                                                disabled
                                            />
                                        </div>

                                        <div className="sm:col-span-6">
                                            <InputLabel htmlFor="remarks" value="Remarks" />
                                            <textarea
                                                id="remarks"
                                                name="remarks"
                                                value={data.remarks}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <InputError message={errors.remarks} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-x-4">
                                    <Link
                                        href={route('payroll.show', payroll.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton type="submit" className="ml-4" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
