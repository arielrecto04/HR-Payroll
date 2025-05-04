import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AttendanceShow({ attendance }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Attendance Details
                </h2>
            }
        >
            <Head title="Attendance Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between">
                        <Link
                            href={route('attendances.index')}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Back to List
                        </Link>
                        <div className="flex space-x-2">
                            <Link
                                href={route('attendances.edit', attendance.id)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Edit
                            </Link>
                            {attendance.status === 'pending' && (
                                <>
                                    <Link
                                        href={route('attendances.approve', attendance.id)}
                                        method="patch"
                                        as="button"
                                        className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                                    >
                                        Approve
                                    </Link>
                                    <Link
                                        href={route('attendances.reject', attendance.id)}
                                        method="patch"
                                        as="button"
                                        className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                    >
                                        Reject
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="mb-4 text-lg font-semibold">Employee Information</h3>
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Employee ID</p>
                                    <p className="mt-1">{attendance.employee?.employee_id || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Employee Name</p>
                                    <p className="mt-1">{attendance.employee?.full_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Department</p>
                                    <p className="mt-1">{attendance.employee?.department || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Position</p>
                                    <p className="mt-1">{attendance.employee?.position || 'N/A'}</p>
                                </div>
                            </div>

                            <h3 className="mb-4 text-lg font-semibold">Attendance Details</h3>
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date</p>
                                    <p className="mt-1">{attendance.date_formatted}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <p className="mt-1">
                                        <AttendanceStatus status={attendance.status} />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Absent</p>
                                    <p className="mt-1">{attendance.is_absent ? 'Yes' : 'No'}</p>
                                </div>
                                {!attendance.is_absent && (
                                    <>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Time In</p>
                                            <p className="mt-1">{attendance.time_in_formatted || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Time Out</p>
                                            <p className="mt-1">{attendance.time_out_formatted || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Hours</p>
                                            <p className="mt-1">{attendance.total_hours ? attendance.total_hours.toFixed(2) : 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Days Worked</p>
                                    <p className="mt-1">{attendance.days_worked}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Late Minutes</p>
                                    <p className="mt-1">{attendance.late_minutes}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Overtime Hours</p>
                                    <p className="mt-1">{attendance.total_overtime_hours || '0'}</p>
                                </div>
                            </div>

                            {attendance.remarks && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-500">Remarks</p>
                                    <p className="mt-1 whitespace-pre-line">{attendance.remarks}</p>
                                </div>
                            )}

                            {attendance.overtime_records && attendance.overtime_records.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="mb-4 text-lg font-semibold">Overtime Records</h3>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Hours
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {attendance.overtime_records.map((record) => (
                                                <tr key={record.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {record.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {record.hours}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {record.overtime_type}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <AttendanceStatus status={record.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
        case 'present':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'Late':
        case 'late':
            bgColor = "bg-yellow-100 text-yellow-800";
            break;
        case 'Absent':
        case 'absent':
            bgColor = "bg-red-100 text-red-800";
            break;
        case 'Half Day':
        case 'half_day':
            bgColor = "bg-orange-100 text-orange-800";
            break;
        case 'On Leave':
        case 'on_leave':
            bgColor = "bg-blue-100 text-blue-800";
            break;
        case 'pending':
            bgColor = "bg-gray-100 text-gray-800";
            break;
        case 'approved':
            bgColor = "bg-green-100 text-green-800";
            break;
        case 'rejected':
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