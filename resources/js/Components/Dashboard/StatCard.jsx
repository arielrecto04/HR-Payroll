import { Link } from '@inertiajs/react';

export default function StatCard({ title, count, icon, color, link }) {
    return (
        <Link href={link} className="block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className={`${color} px-6 py-5 text-white relative h-32 flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <div className="rounded-full bg-white/20 p-2">
                            <i className={`fas fa-${icon} text-xl`}></i>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-4xl font-bold">{count}</p>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                        <i className={`fas fa-${icon} text-8xl`}></i>
                    </div>
                </div>
                <div className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        <span>View Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
} 