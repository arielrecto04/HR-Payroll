import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmployeeCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        birth_date: '',
        gender: '',
        civil_status: '',
        address: '',
        contact_number: '',
        email: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        date_hired: '',
        employee_type: 'Regular',
        department: '',
        position: '',
        basic_salary: '',
        salary_type: 'Monthly',
        
        // Government IDs
        sss_number: '',
        philhealth_number: '',
        pagibig_number: '',
        tin_number: '',
        
        // Bank details
        bank_name: '',
        bank_account_number: '',
        
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employee.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add New Employee
                </h2>
            }
        >
            <Head title="Add New Employee" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6 border-b border-gray-200 pb-5">
                                    <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="first_name" value="First Name" />
                                            <TextInput
                                                id="first_name"
                                                type="text"
                                                name="first_name"
                                                value={data.first_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('first_name', e.target.value)}
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
                                                onChange={(e) => setData('middle_name', e.target.value)}
                                            />
                                            <InputError message={errors.middle_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="last_name" value="Last Name" />
                                            <TextInput
                                                id="last_name"
                                                type="text"
                                                name="last_name"
                                                value={data.last_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.last_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="extension" value="Name Extension (Jr, Sr, III)" />
                                            <TextInput
                                                id="extension"
                                                type="text"
                                                name="extension"
                                                value={data.extension}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('extension', e.target.value)}
                                            />
                                            <InputError message={errors.extension} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="birth_date" value="Birth Date" />
                                            <TextInput
                                                id="birth_date"
                                                type="date"
                                                name="birth_date"
                                                value={data.birth_date}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.birth_date} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="gender" value="Gender" />
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={data.gender}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) => setData('gender', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            <InputError message={errors.gender} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="civil_status" value="Civil Status" />
                                            <select
                                                id="civil_status"
                                                name="civil_status"
                                                value={data.civil_status}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) => setData('civil_status', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                            </select>
                                            <InputError message={errors.civil_status} className="mt-2" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <InputLabel htmlFor="address" value="Address" />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('address', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="contact_number" value="Contact Number" />
                                            <TextInput
                                                id="contact_number"
                                                type="text"
                                                name="contact_number"
                                                value={data.contact_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('contact_number', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.contact_number} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 border-b border-gray-200 pb-5">
                                    <h3 className="mb-4 text-lg font-medium">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="emergency_contact_name" value="Emergency Contact Name" />
                                            <TextInput
                                                id="emergency_contact_name"
                                                type="text"
                                                name="emergency_contact_name"
                                                value={data.emergency_contact_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="emergency_contact_number" value="Emergency Contact Number" />
                                            <TextInput
                                                id="emergency_contact_number"
                                                type="text"
                                                name="emergency_contact_number"
                                                value={data.emergency_contact_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('emergency_contact_number', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 border-b border-gray-200 pb-5">
                                    <h3 className="mb-4 text-lg font-medium">Employment Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="date_hired" value="Date Hired" />
                                            <TextInput
                                                id="date_hired"
                                                type="date"
                                                name="date_hired"
                                                value={data.date_hired}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('date_hired', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.date_hired} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="employee_type" value="Employee Type" />
                                            <select
                                                id="employee_type"
                                                name="employee_type"
                                                value={data.employee_type}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) => setData('employee_type', e.target.value)}
                                                required
                                            >
                                                <option value="Regular">Regular</option>
                                                <option value="Contractual">Contractual</option>
                                                <option value="Probationary">Probationary</option>
                                                <option value="Part-time">Part-time</option>
                                            </select>
                                            <InputError message={errors.employee_type} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="department" value="Department" />
                                            <TextInput
                                                id="department"
                                                type="text"
                                                name="department"
                                                value={data.department}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('department', e.target.value)}
                                                required
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
                                                onChange={(e) => setData('position', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.position} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="basic_salary" value="Basic Salary" />
                                            <TextInput
                                                id="basic_salary"
                                                type="number"
                                                step="0.01"
                                                name="basic_salary"
                                                value={data.basic_salary}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('basic_salary', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.basic_salary} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="salary_type" value="Salary Type" />
                                            <select
                                                id="salary_type"
                                                name="salary_type"
                                                value={data.salary_type}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) => setData('salary_type', e.target.value)}
                                                required
                                            >
                                                <option value="Monthly">Monthly</option>
                                                <option value="Semi-Monthly">Semi-Monthly</option>
                                                <option value="Weekly">Weekly</option>
                                                <option value="Daily">Daily</option>
                                                <option value="Hourly">Hourly</option>
                                            </select>
                                            <InputError message={errors.salary_type} className="mt-2" />
                                        </div>
                                        <div className="flex items-center pt-5">
                                            <Checkbox
                                                id="is_active"
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <InputLabel htmlFor="is_active" value="Active Employee" className="ml-2" />
                                            <InputError message={errors.is_active} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 border-b border-gray-200 pb-5">
                                    <h3 className="mb-4 text-lg font-medium">Government IDs</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="sss_number" value="SSS Number" />
                                            <TextInput
                                                id="sss_number"
                                                type="text"
                                                name="sss_number"
                                                value={data.sss_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('sss_number', e.target.value)}
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
                                                onChange={(e) => setData('philhealth_number', e.target.value)}
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
                                                onChange={(e) => setData('pagibig_number', e.target.value)}
                                            />
                                            <InputError message={errors.pagibig_number} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="tin_number" value="TIN Number" />
                                            <TextInput
                                                id="tin_number"
                                                type="text"
                                                name="tin_number"
                                                value={data.tin_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('tin_number', e.target.value)}
                                            />
                                            <InputError message={errors.tin_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-4 text-lg font-medium">Bank Details</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="bank_name" value="Bank Name" />
                                            <TextInput
                                                id="bank_name"
                                                type="text"
                                                name="bank_name"
                                                value={data.bank_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('bank_name', e.target.value)}
                                            />
                                            <InputError message={errors.bank_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="bank_account_number" value="Bank Account Number" />
                                            <TextInput
                                                id="bank_account_number"
                                                type="text"
                                                name="bank_account_number"
                                                value={data.bank_account_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('bank_account_number', e.target.value)}
                                            />
                                            <InputError message={errors.bank_account_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('employee.index')}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>Save Employee</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 