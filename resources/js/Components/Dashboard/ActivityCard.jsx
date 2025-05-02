export default function ActivityCard({ title, children }) {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm h-full">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    {title === "Recent Activities" && (
                        <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full">Today</span>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
} 