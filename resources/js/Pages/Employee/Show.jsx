import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function EmployeeShow({ employee }) {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

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

                            {/* Personal Information */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-md font-medium text-gray-700">Personal Information</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Employee ID</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.employee_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Full Name</h5>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {employee.first_name} {employee.middle_name ? `${employee.middle_name} ` : ''}
                                            {employee.last_name} {employee.suffix ? employee.suffix : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Birth Date</h5>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(employee.birth_date)}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Gender</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.gender || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Civil Status</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.civil_status || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Nationality</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.nationality || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-md font-medium text-gray-700">Contact Information</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Address</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Contact Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.contact_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Email</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Emergency Contact Name</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.emergency_contact_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Emergency Contact Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.emergency_contact_number || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Employment Information */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-md font-medium text-gray-700">Employment Information</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Date Hired</h5>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(employee.date_hired)}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Department</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Position</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.position || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Employment Status</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.employment_status || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Status</h5>
                                        <p className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium 
                                            bg-green-100 text-green-800">
                                            {employee.status || 'Active'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Salary Information */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-md font-medium text-gray-700">Salary Information</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Basic Salary</h5>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {employee.basic_salary ? `₱${parseFloat(employee.basic_salary).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Salary Type</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.salary_type || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Government IDs */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-md font-medium text-gray-700">Government IDs</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">TIN Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.tin_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">SSS Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.sss_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">PhilHealth Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.philhealth_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-500">Pag-IBIG Number</h5>
                                        <p className="mt-1 text-sm text-gray-900">{employee.pagibig_number || 'N/A'}</p>
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