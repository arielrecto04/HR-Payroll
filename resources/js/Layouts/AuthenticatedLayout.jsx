import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Sidebar navigation item component
const SidebarNavItem = ({ href, icon, active, children, isMinimized }) => {
    return (
        <NavLink
            href={href}
            active={active}
            className={`flex items-center ${isMinimized ? 'justify-center' : ''} px-4 py-2 mt-2 rounded-md hover:bg-[#3e3e8b] w-full text-white`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${!isMinimized ? 'mr-3' : ''} text-white`} viewBox="0 0 20 20" fill="currentColor">
                {icon}
            </svg>
            {!isMinimized && <span className="text-white">{children}</span>}
        </NavLink>
    );
};

// Sidebar navigation items data
const sidebarItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        routeName: 'dashboard',
        icon: 'dashboard',
        active: route => route().current('dashboard')
    },
    {
        name: 'Employee',
        href: '/employees',
        routeName: 'employees.index',
        icon: 'employee',
        active: route => route().current('employees.*')
    },
    {
        name: 'Attendance',
        href: '/attendances',
        routeName: 'attendances.index',
        icon: 'attendance',
        active: route => route().current('attendances.*')
    },
    {
        name: 'Payroll',
        href: '/payroll',
        routeName: 'payroll.index',
        icon: 'payroll',
        active: route => route().current('payroll.*')
    },
    {
        name: 'Deductions',
        href: '#',
        icon: 'deductions',
        active: () => false
    },
    {
        name: 'Department',
        href: '#',
        icon: 'department',
        active: () => false
    }
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true); // Default to minimized sidebar

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    // Icons for navigation
    const icons = {
        dashboard: <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />,
        employee: <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />,
        attendance: <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />,
        payroll: <>{<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />}
                  {<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />}</>,
        deductions: <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />,
        department: <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />,
        profile: <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />,
        settings: <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />,
        logout: <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Fixed position */}
            <div className={`bg-[#2f2f69] text-white ${isMinimized ? 'w-16' : 'w-64'} fixed left-0 top-0 bottom-0 z-10 flex flex-col transition-all duration-300 ease-in-out`}>
                {/* Logo */}
                <div className="px-4 py-5 flex items-center justify-center border-b border-gray-700">
                    <ApplicationLogo className="h-9 w-auto fill-current text-white" />
                    {!isMinimized && <span className="ml-3 text-xl font-semibold text-white">Payroll</span>}
                </div>

                {/* Main Navigation Section - No overflow scroll */}
                <div className="flex-1 flex flex-col py-4">
                    {/* Main Menu Section */}
                    <div className={`${isMinimized ? 'px-2' : 'px-4'} mb-6`}>
                        {!isMinimized && <p className="text-gray-300 uppercase text-xs font-semibold mb-2">Main Menu</p>}
                        <nav className={`${isMinimized ? 'flex flex-col items-center' : ''}`}>
                            {sidebarItems.map((item) => (
                                <SidebarNavItem 
                                    key={item.name}
                                    href={item.href} 
                                    icon={icons[item.icon]}
                                    active={item.active(route)}
                                    isMinimized={isMinimized}
                                >
                                    {item.name}
                                </SidebarNavItem>
                            ))}
                        </nav>
                    </div>

                    {/* Empty space to push account section to bottom */}
                    <div className="flex-grow"></div>

                    {/* Account section - moved to bottom */}
                    <div className={`${isMinimized ? 'px-2' : 'px-4'} mb-8`}>
                        {!isMinimized && <p className="text-gray-300 uppercase text-xs font-semibold mb-2">Account</p>}
                        {isMinimized && <div className="border-t border-gray-700 w-10 mx-auto my-4"></div>}
                        
                        <nav className={`${isMinimized ? 'flex flex-col items-center' : ''}`}>
                            <SidebarNavItem 
                                href={route('profile.edit')} 
                                icon={icons.profile}
                                active={route().current('profile.edit')}
                                isMinimized={isMinimized}
                            >
                                Profile
                            </SidebarNavItem>
                            
                            <SidebarNavItem 
                                href="#" 
                                icon={icons.settings}
                                active={false}
                                isMinimized={isMinimized}
                            >
                                Settings
                            </SidebarNavItem>
                            
                            {!isMinimized && (
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center px-4 py-2 mt-2 rounded-md hover:bg-[#3e3e8b] w-full text-left text-sm font-medium text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        {icons.logout}
                                    </svg>
                                    <span className="text-white">Log Out</span>
                                </Link>
                            )}
                            
                            {isMinimized && (
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center justify-center px-4 py-2 mt-2 rounded-md hover:bg-[#3e3e8b] w-full text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        {icons.logout}
                                    </svg>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content - Add margin to match sidebar width */}
            <div className={`flex-1 flex flex-col ${isMinimized ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
                <nav className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex items-center">
                                {/* Sidebar toggle button */}
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                                    aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="hidden sm:flex sm:items-center">
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:outline-none focus:text-gray-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            {/* Responsive Mobile Menu */}
            <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                <div className="space-y-1 pb-3 pt-2">
                    {sidebarItems.map((item) => (
                        <ResponsiveNavLink 
                            key={item.name}
                            href={item.href} 
                            active={item.active(route)}
                        >
                            {item.name}
                        </ResponsiveNavLink>
                    ))}
                </div>

                <div className="border-t border-gray-200 pb-1 pt-4">
                    <div className="px-4">
                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                        <ResponsiveNavLink href="#">Settings</ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
