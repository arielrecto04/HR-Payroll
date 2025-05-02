import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function EmployeeShow({ employee }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Employee Details
                </h2>
            }
        >
            <Head title="Employee Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Employee Information</h3>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/employees/${employee.id}/edit`}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Edit Employee
                                    </Link>
                                    <Link
                                        href="/employees"
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Employee ID</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.employee_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {employee.first_name} {employee.middle_name ? `${employee.middle_name} ` : ''}
                                            {employee.last_name} {employee.suffix ? employee.suffix : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Position</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.position || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Department</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                        <p className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium 
                                            bg-green-100 text-green-800">
                                            {employee.status || 'Active'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Date Hired</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.date_hired || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Employment Status</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.employment_status || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.contact_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                        <p className="mt-1 text-sm text-gray-900">{employee.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 