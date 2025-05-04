import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AttendanceEdit({ attendance, employees }) {
    const { data, setData, patch, processing, errors } = useForm({
        employee_id: attendance.employee?.employee_id || '',
        date: attendance.date_formatted || '',
        time_in: attendance.time_in_for_input || '',
        time_out: attendance.time_out_for_input || '',
        days_worked: attendance.days_worked,
        late_minutes: attendance.late_minutes || 0,
        is_absent: attendance.is_absent || false,
        remarks: attendance.remarks || '',
        status: attendance.status || 'pending',
    });

    // Ensure we properly initialize the form values
    useEffect(() => {
        if (attendance.is_absent) {
            // If marked as absent, ensure time fields are empty
            setData(data => ({
                ...data,
                time_in: '',
                time_out: '',
                days_worked: 0,
                late_minutes: 0
            }));
        }
    }, [attendance.is_absent]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('attendances.update', attendance.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Attendance
                </h2>
            }
        >
            <Head title="Edit Attendance" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Employee
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.employee_id}
                                        onChange={e => setData('employee_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(employee => (
                                            <option key={employee.employee_id} value={employee.employee_id}>
                                                {employee.last_name}, {employee.first_name} ({employee.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.employee_id && <div className="mt-1 text-sm text-red-600">{errors.employee_id}</div>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        required
                                    />
                                    {errors.date && <div className="mt-1 text-sm text-red-600">{errors.date}</div>}
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            checked={data.is_absent}
                                            onChange={e => setData('is_absent', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Mark as Absent</span>
                                    </label>
                                    {errors.is_absent && <div className="mt-1 text-sm text-red-600">{errors.is_absent}</div>}
                                </div>

                                {!data.is_absent && (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Time In
                                            </label>
                                            <input
                                                type="time"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={data.time_in}
                                                onChange={e => setData('time_in', e.target.value)}
                                            />
                                            {errors.time_in && <div className="mt-1 text-sm text-red-600">{errors.time_in}</div>}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Time Out
                                            </label>
                                            <input
                                                type="time"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={data.time_out}
                                                onChange={e => setData('time_out', e.target.value)}
                                            />
                                            {errors.time_out && <div className="mt-1 text-sm text-red-600">{errors.time_out}</div>}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Late Minutes
                                            </label>
                                            <input
                                                type="number"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={data.late_minutes}
                                                onChange={e => setData('late_minutes', e.target.value)}
                                                min="0"
                                            />
                                            {errors.late_minutes && <div className="mt-1 text-sm text-red-600">{errors.late_minutes}</div>}
                                        </div>
                                    </>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Days Worked
                                    </label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.days_worked}
                                        onChange={e => setData('days_worked', e.target.value)}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                    />
                                    {errors.days_worked && <div className="mt-1 text-sm text-red-600">{errors.days_worked}</div>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Remarks
                                    </label>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.remarks}
                                        onChange={e => setData('remarks', e.target.value)}
                                        rows="3"
                                    ></textarea>
                                    {errors.remarks && <div className="mt-1 text-sm text-red-600">{errors.remarks}</div>}
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('attendances.show', attendance.id)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={processing}
                                    >
                                        Update Attendance
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 