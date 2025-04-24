import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PayrollIndex({ payrollRuns = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    
    const filteredPayrollRuns = payrollRuns.filter(payroll => 
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
                        
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Payroll Reports</h3>
                            <p className="mb-4 text-sm text-gray-500">Generate payroll reports and tax statements.</p>
                            <Link
                                href="/payroll/reports"
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                View Reports
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Government Remittances</h3>
                            <p className="mb-4 text-sm text-gray-500">Generate SSS, PhilHealth, Pag-IBIG, and tax remittances.</p>
                            <Link
                                href="/payroll/remittances"
                                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Manage Remittances
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
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Payroll Period
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Period Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Start Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                End Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Total Employees
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Total Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredPayrollRuns.length > 0 ? (
                                            filteredPayrollRuns.map((payroll) => (
                                                <tr key={payroll.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {payroll.payroll_period}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {payroll.period_type}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {payroll.start_date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {payroll.end_date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {payroll.total_employees}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        ₱{payroll.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <PayrollStatus status={payroll.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <Link
                                                            href={`/payroll/${payroll.id}/view`}
                                                            className="mr-2 text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {payroll.status !== 'Finalized' && (
                                                            <Link
                                                                href={`/payroll/${payroll.id}/edit`}
                                                                className="mr-2 text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={`/payroll/${payroll.id}/payslips`}
                                                            className="mr-2 text-green-600 hover:text-green-900"
                                                        >
                                                            Payslips
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
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