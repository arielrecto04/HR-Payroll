import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// PayrollInfoBox component for condensed payroll information
const PayrollInfoBox = ({ payroll }) => {
    return (
        <div className="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Earnings Section */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Earnings</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Basic Pay</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.regular_earnings?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Overtime Earnings</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.overtime_earnings?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Holiday Pay</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.holiday_pay?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Allowances</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.allowances?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Other Earnings</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.other_earnings?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium">Gross Pay</span>
                            <span className="text-sm font-semibold">
                                ₱{payroll?.gross_pay?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Deductions Section */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Deductions</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">SSS</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.sss_contribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">PhilHealth</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.philhealth_contribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Pag-IBIG</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.pagibig_contribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tax Withheld</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.tax_withheld?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Loans</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.loan_deductions?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium">Total Deductions</span>
                            <span className="text-sm font-semibold">
                                ₱{payroll?.total_deductions?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Days Worked</span>
                            <span className="text-sm font-medium">{payroll?.days_worked || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Absences</span>
                            <span className="text-sm font-medium">{payroll?.absences || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Overtime Hours</span>
                            <span className="text-sm font-medium">{payroll?.overtime_hours || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Gross Pay</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.gross_pay?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Deductions</span>
                            <span className="text-sm font-medium">
                                ₱{payroll?.total_deductions?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-indigo-900">Net Pay</span>
                            <span className="text-lg font-bold text-indigo-900">
                                ₱{payroll?.net_pay?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PayrollShow({ payroll }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payroll Details
                </h2>
            }
        >
            <Head title="Payroll Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Payroll: {payroll?.payroll_period || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {payroll?.start_date ? `${payroll.start_date} to ${payroll.end_date}` : ''}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {payroll?.status === 'draft' && (
                                <>
                                    <Link
                                        href={`/payroll/${payroll.id}/edit`}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/payroll`}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back
                                    </Link>
                                </>
                            )}
                            
                            {payroll?.status === 'processing' && (
                                <Link
                                    href={`/payroll/${payroll.id}/approve`}
                                    method="patch"
                                    as="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Approve
                                </Link>
                            )}
                            
                            {payroll?.status === 'approved' && (
                                <Link
                                    href={`/payroll/${payroll.id}/paid`}
                                    method="patch"
                                    as="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Mark as Paid
                                </Link>
                            )}
                            
                            <Link
                                href={`/payroll/${payroll.id}/payslips`}
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                View Payslips
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Employee Information</h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Employee Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {payroll?.employee?.first_name ? 
                                                `${payroll.employee.first_name} ${payroll.employee.middle_name || ''} ${payroll.employee.last_name}` 
                                                : '-'}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{payroll?.employee?.employee_id || '-'}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{payroll?.employee?.position || '-'}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Basic Salary</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            ₱{payroll?.monthly_salary?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Payroll Details</h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Payroll Period</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{payroll?.payroll_period || '-'}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Payment Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{payroll?.payment_date || '-'}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            <PayrollStatus status={payroll?.status || 'draft'} />
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{payroll?.remarks || '-'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                    
                    {/* Condensed Payroll Information Box */}
                    <PayrollInfoBox payroll={payroll} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function PayrollStatus({ status }) {
    let bgColor = "bg-gray-100 text-gray-800";
    
    switch(status.toLowerCase()) {
        case 'draft':
            bgColor = "bg-yellow-100 text-yellow-800";
            break;
        case 'processing':
            bgColor = "bg-blue-100 text-blue-800";
            break;
        case 'approved':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'paid':
            bgColor = "bg-purple-100 text-purple-800";
            break;
        default:
            bgColor = "bg-gray-100 text-gray-800";
    }
    
    return (
        <span className={`inline-flex rounded-full ${bgColor} px-2 text-xs font-semibold leading-5`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}