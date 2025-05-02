import { Link } from '@inertiajs/react';

export default function QuickLinkItem({ href, icon, children }) {
    return (
        <Link 
            href={href} 
            className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors group"
        >
            <div className="mr-3 flex-shrink-0 text-gray-400 group-hover:text-blue-500">
                <i className={`fas fa-${icon} text-lg`}></i>
            </div>
            <span className="text-sm font-medium">{children}</span>
        </Link>
    );
} 