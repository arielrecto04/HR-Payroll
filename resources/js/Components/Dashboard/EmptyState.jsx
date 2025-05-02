export default function EmptyState({ icon, title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-3">
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>
            <p className="text-gray-500 text-sm">{title || "No data found"}</p>
            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
    );
} 