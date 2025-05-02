import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmployeeEdit({ employee }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        suffix: employee.suffix || '',
        birth_date: employee.birth_date || '',
        gender: employee.gender || '',
        civil_status: employee.civil_status || '',
        nationality: employee.nationality || '',
        address: employee.address || '',
        contact_number: employee.contact_number || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_number: employee.emergency_contact_number || '',
        tin_number: employee.tin_number || '',
        sss_number: employee.sss_number || '',
        philhealth_number: employee.philhealth_number || '',
        pagibig_number: employee.pagibig_number || '',
        date_hired: employee.date_hired || '',
        employment_status: employee.employment_status || '',
        department: employee.department || '',
        position: employee.position || '',
        status: employee.status || 'Active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Employee
                </h2>
            }
        >
            <Head title="Edit Employee" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Employee Details</h3>
                        <Link
                            href="/employees"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back to List
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                {/* Personal Information */}
                                <div className="mb-8">
                                    <h4 className="mb-4 text-md font-medium text-gray-700">Personal Information</h4>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="employee_id" value="Employee ID" required />
                                            <TextInput
                                                id="employee_id"
                                                type="text"
                                                name="employee_id"
                                                value={data.employee_id}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.employee_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="first_name" value="First Name" required />
                                            <TextInput
                                                id="first_name"
                                                type="text"
                                                name="first_name"
                                                value={data.first_name}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.first_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="middle_name" value="Middle Name" />
                                            <TextInput
                                                id="middle_name"
                                                type="text"
                                                name="middle_name"
                                                value={data.middle_name}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.middle_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="last_name" value="Last Name" required />
                                            <TextInput
                                                id="last_name"
                                                type="text"
                                                name="last_name"
                                                value={data.last_name}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.last_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="suffix" value="Suffix" />
                                            <TextInput
                                                id="suffix"
                                                type="text"
                                                name="suffix"
                                                value={data.suffix}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.suffix} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="birth_date" value="Birth Date" required />
                                            <TextInput
                                                id="birth_date"
                                                type="date"
                                                name="birth_date"
                                                value={data.birth_date}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.birth_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="gender" value="Gender" required />
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={data.gender}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <InputError message={errors.gender} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="civil_status" value="Civil Status" required />
                                            <select
                                                id="civil_status"
                                                name="civil_status"
                                                value={data.civil_status}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                            <InputError message={errors.civil_status} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="nationality" value="Nationality" required />
                                            <TextInput
                                                id="nationality"
                                                type="text"
                                                name="nationality"
                                                value={data.nationality}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.nationality} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="mb-8">
                                    <h4 className="mb-4 text-md font-medium text-gray-700">Contact Information</h4>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="address" value="Address" required />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="contact_number" value="Contact Number" required />
                                            <TextInput
                                                id="contact_number"
                                                type="text"
                                                name="contact_number"
                                                value={data.contact_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.contact_number} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="emergency_contact_name" value="Emergency Contact Name" required />
                                            <TextInput
                                                id="emergency_contact_name"
                                                type="text"
                                                name="emergency_contact_name"
                                                value={data.emergency_contact_name}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="emergency_contact_number" value="Emergency Contact Number" required />
                                            <TextInput
                                                id="emergency_contact_number"
                                                type="text"
                                                name="emergency_contact_number"
                                                value={data.emergency_contact_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Information */}
                                <div className="mb-8">
                                    <h4 className="mb-4 text-md font-medium text-gray-700">Employment Information</h4>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="date_hired" value="Date Hired" required />
                                            <TextInput
                                                id="date_hired"
                                                type="date"
                                                name="date_hired"
                                                value={data.date_hired}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <InputError message={errors.date_hired} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="department" value="Department" />
                                            <TextInput
                                                id="department"
                                                type="text"
                                                name="department"
                                                value={data.department}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.department} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="position" value="Position" />
                                            <TextInput
                                                id="position"
                                                type="text"
                                                name="position"
                                                value={data.position}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.position} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="employment_status" value="Employment Status" required />
                                            <select
                                                id="employment_status"
                                                name="employment_status"
                                                value={data.employment_status}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Employment Status</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Probationary">Probationary</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Project-based">Project-based</option>
                                            </select>
                                            <InputError message={errors.employment_status} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="status" value="Status" required />
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="On Leave">On Leave</option>
                                                <option value="Terminated">Terminated</option>
                                            </select>
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Government IDs */}
                                <div className="mb-8">
                                    <h4 className="mb-4 text-md font-medium text-gray-700">Government IDs</h4>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="tin_number" value="TIN Number" />
                                            <TextInput
                                                id="tin_number"
                                                type="text"
                                                name="tin_number"
                                                value={data.tin_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.tin_number} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="sss_number" value="SSS Number" />
                                            <TextInput
                                                id="sss_number"
                                                type="text"
                                                name="sss_number"
                                                value={data.sss_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.sss_number} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="philhealth_number" value="PhilHealth Number" />
                                            <TextInput
                                                id="philhealth_number"
                                                type="text"
                                                name="philhealth_number"
                                                value={data.philhealth_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.philhealth_number} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="pagibig_number" value="Pag-IBIG Number" />
                                            <TextInput
                                                id="pagibig_number"
                                                type="text"
                                                name="pagibig_number"
                                                value={data.pagibig_number}
                                                className="mt-1 block w-full"
                                                onChange={handleInputChange}
                                            />
                                            <InputError message={errors.pagibig_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update Employee
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