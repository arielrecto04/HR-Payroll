import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AttendanceIndex({ attendances = [], employees = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    
    const filteredAttendances = attendances.filter(attendance => 
        (attendance.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         attendance.employee_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (dateFilter ? attendance.date === dateFilter : true)
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Attendance Management
                </h2>
            }
        >
            <Head title="Attendance Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Record Attendance</h3>
                            <p className="mb-4 text-sm text-gray-500">Record employee time in, time out and attendance status.</p>
                            <Link
                                href="/attendance/record"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Record Attendance
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Upload Biometric Data</h3>
                            <p className="mb-4 text-sm text-gray-500">Import attendance data from biometric devices.</p>
                            <Link
                                href="/attendance/import"
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Upload Data
                            </Link>
                        </div>
                        
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Attendance Reports</h3>
                            <p className="mb-4 text-sm text-gray-500">Generate attendance reports for payroll processing.</p>
                            <Link
                                href="/attendance/reports"
                                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                View Reports
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mb-6 flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..." 
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <input 
                                type="date" 
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Employee ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Employee Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Time In
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Time Out
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
                                        {filteredAttendances.length > 0 ? (
                                            filteredAttendances.map((attendance) => (
                                                <tr key={attendance.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {attendance.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {attendance.employee_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {attendance.employee_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {attendance.time_in}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {attendance.time_out}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <AttendanceStatus status={attendance.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <Link
                                                            href={`/attendance/${attendance.id}/edit`}
                                                            className="mr-2 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No attendance records found
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

function AttendanceStatus({ status }) {
    let bgColor = "bg-gray-100 text-gray-800";
    
    switch(status) {
        case 'Present':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'Late':
            bgColor = "bg-yellow-100 text-yellow-800";
            break;
        case 'Absent':
            bgColor = "bg-red-100 text-red-800";
            break;
        case 'Half Day':
            bgColor = "bg-orange-100 text-orange-800";
            break;
        case 'On Leave':
            bgColor = "bg-blue-100 text-blue-800";
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