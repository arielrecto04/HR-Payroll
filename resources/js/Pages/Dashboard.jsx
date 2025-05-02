import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Import Dashboard Components
import StatCard from '@/Components/Dashboard/StatCard';
import ActivityCard from '@/Components/Dashboard/ActivityCard';
import QuickLinkItem from '@/Components/Dashboard/QuickLinkItem';
import EmptyState from '@/Components/Dashboard/EmptyState';

export default function Dashboard() {
    // Animation state for cards
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        // Trigger animation after component mounts
        setAnimate(true);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    HR & Payroll Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Stat Cards with staggered animation */}
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                            <StatCard 
                                title="Employee Management" 
                                icon="users" 
                                count="0" 
                                link="/employees" 
                                color="bg-blue-500" 
                            />
                        </div>
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                            <StatCard 
                                title="Attendance" 
                                icon="clock" 
                                count="0" 
                                link="/attendances" 
                                color="bg-green-500" 
                            />
                        </div>
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                            <StatCard 
                                title="Payroll" 
                                icon="money-bill" 
                                count="0" 
                                link="#" 
                                color="bg-purple-500" 
                            />
                        </div>
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                            <StatCard 
                                title="Government Remittances" 
                                icon="building" 
                                count="0" 
                                link="#" 
                                color="bg-red-500" 
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                            <ActivityCard title="Recent Activities">
                                <EmptyState 
                                    title="No recent activities found."
                                    subtitle="Activities will appear here as you use the system."
                                />
                            </ActivityCard>
                        </div>
                        
                        <div className={`transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                            <ActivityCard title="Quick Links">
                                <div className="space-y-1">
                                    <QuickLinkItem href="/employees/create" icon="user-plus">
                                        Add New Employee
                                    </QuickLinkItem>
                                    <QuickLinkItem href="/attendances/create" icon="calendar-check">
                                        Record Attendance
                                    </QuickLinkItem>
                                    <QuickLinkItem href="#" icon="calculator">
                                        Generate Payroll
                                    </QuickLinkItem>
                                    <QuickLinkItem href="#" icon="file-alt">
                                        Payroll Reports
                                    </QuickLinkItem>
                                </div>
                            </ActivityCard>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
