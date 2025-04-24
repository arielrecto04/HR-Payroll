import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    HR & Payroll Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <DashboardCard 
                            title="Employee Management" 
                            icon="users" 
                            count="0" 
                            link="/employee" 
                            color="bg-blue-500" 
                        />
                        <DashboardCard 
                            title="Attendance" 
                            icon="clock" 
                            count="0" 
                            link="/attendance" 
                            color="bg-green-500" 
                        />
                        <DashboardCard 
                            title="Payroll" 
                            icon="money-bill" 
                            count="0" 
                            link="/payroll" 
                            color="bg-purple-500" 
                        />
                        <DashboardCard 
                            title="Government Remittances" 
                            icon="building-government" 
                            count="0" 
                            link="/payroll/remittances" 
                            color="bg-red-500" 
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white p-6">
                                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                                <p className="mt-3 text-gray-500">No recent activities found.</p>
                            </div>
                        </div>
                        
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white p-6">
                                <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                                <div className="mt-3 space-y-2">
                                    <Link href="/employee/create" className="block text-blue-600 hover:underline">Add New Employee</Link>
                                    <Link href="/attendance/record" className="block text-blue-600 hover:underline">Record Attendance</Link>
                                    <Link href="/payroll/generate" className="block text-blue-600 hover:underline">Generate Payroll</Link>
                                    <Link href="/payroll/reports" className="block text-blue-600 hover:underline">Payroll Reports</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function DashboardCard({ title, icon, count, link, color }) {
    return (
        <Link href={link}>
            <div className="overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className={`${color} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <i className={`fas fa-${icon} text-2xl`}></i>
                    </div>
                    <p className="mt-2 text-3xl font-bold">{count}</p>
                </div>
                <div className="bg-white p-4">
                    <span className="text-sm text-gray-600">View Details →</span>
                </div>
            </div>
        </Link>
    );
}
