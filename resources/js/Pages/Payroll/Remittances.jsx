import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PayrollRemittances({ remittances = [] }) {
    const [remittanceType, setRemittanceType] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    const filteredRemittances = remittances.filter(remittance => 
        (remittanceType ? remittance.type === remittanceType : true) && 
        (periodFilter ? remittance.period === periodFilter : true) &&
        (statusFilter ? remittance.status === statusFilter : true)
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Government Remittances
                </h2>
            }
        >
            <Head title="Government Remittances" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-blue-50 p-6 shadow">
                            <h3 className="mb-2 text-lg font-medium text-blue-800">SSS Remittances</h3>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-2xl font-bold text-blue-600">₱0.00</div>
                                <div className="text-sm text-blue-500">Pending</div>
                            </div>
                            <Link
                                href="/payroll/remittances/generate?type=SSS"
                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Generate Report
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-red-50 p-6 shadow">
                            <h3 className="mb-2 text-lg font-medium text-red-800">PhilHealth Remittances</h3>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-2xl font-bold text-red-600">₱0.00</div>
                                <div className="text-sm text-red-500">Pending</div>
                            </div>
                            <Link
                                href="/payroll/remittances/generate?type=PhilHealth"
                                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Generate Report
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-green-50 p-6 shadow">
                            <h3 className="mb-2 text-lg font-medium text-green-800">Pag-IBIG Remittances</h3>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-2xl font-bold text-green-600">₱0.00</div>
                                <div className="text-sm text-green-500">Pending</div>
                            </div>
                            <Link
                                href="/payroll/remittances/generate?type=PagIBIG"
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Generate Report
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-purple-50 p-6 shadow">
                            <h3 className="mb-2 text-lg font-medium text-purple-800">Tax Remittances</h3>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-2xl font-bold text-purple-600">₱0.00</div>
                                <div className="text-sm text-purple-500">Pending</div>
                            </div>
                            <Link
                                href="/payroll/remittances/generate?type=Tax"
                                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Generate Report
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={remittanceType}
                                onChange={(e) => setRemittanceType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="SSS">SSS</option>
                                <option value="PhilHealth">PhilHealth</option>
                                <option value="PagIBIG">Pag-IBIG</option>
                                <option value="Tax">Tax</option>
                            </select>
                            
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value)}
                            >
                                <option value="">All Periods</option>
                                <option value="January 2023">January 2023</option>
                                <option value="February 2023">February 2023</option>
                                <option value="March 2023">March 2023</option>
                                <option value="April 2023">April 2023</option>
                                <option value="May 2023">May 2023</option>
                                <option value="June 2023">June 2023</option>
                            </select>
                            
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Remitted">Remitted</option>
                                <option value="Overdue">Overdue</option>
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
                                                Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Period
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Due Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Amount
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
                                        {filteredRemittances.length > 0 ? (
                                            filteredRemittances.map((remittance) => (
                                                <tr key={remittance.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        <RemittanceTypeBadge type={remittance.type} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {remittance.period}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {remittance.due_date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        ₱{remittance.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <RemittanceStatusBadge status={remittance.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <Link
                                                            href={`/payroll/remittances/${remittance.id}/view`}
                                                            className="mr-2 text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {remittance.status === 'Pending' && (
                                                            <Link
                                                                href={`/payroll/remittances/${remittance.id}/mark-as-remitted`}
                                                                className="mr-2 text-green-600 hover:text-green-900"
                                                            >
                                                                Mark as Remitted
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={`/payroll/remittances/${remittance.id}/download`}
                                                            className="mr-2 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Download
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No remittance records found
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

function RemittanceTypeBadge({ type }) {
    let bgColor = "bg-gray-100 text-gray-800";
    
    switch(type) {
        case 'SSS':
            bgColor = "bg-blue-100 text-blue-800";
            break;
        case 'PhilHealth':
            bgColor = "bg-red-100 text-red-800";
            break;
        case 'PagIBIG':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'Tax':
            bgColor = "bg-purple-100 text-purple-800";
            break;
        default:
            bgColor = "bg-gray-100 text-gray-800";
    }
    
    return (
        <span className={`inline-flex rounded-full ${bgColor} px-2 text-xs font-semibold leading-5`}>
            {type}
        </span>
    );
}

function RemittanceStatusBadge({ status }) {
    let bgColor = "bg-gray-100 text-gray-800";
    
    switch(status) {
        case 'Pending':
            bgColor = "bg-yellow-100 text-yellow-800";
            break;
        case 'Remitted':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'Overdue':
            bgColor = "bg-red-100 text-red-800";
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