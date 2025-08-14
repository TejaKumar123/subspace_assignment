export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col items-center">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                {/* Text */}
                <p className="mt-4 text-gray-300 font-medium">
                    Checking authentication...
                </p>
            </div>
        </div>
    );
}
