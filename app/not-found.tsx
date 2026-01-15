import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <h2 className="text-4xl font-bold text-blue-500 mb-4 font-mono">404</h2>
            <h3 className="text-2xl text-white mb-6">Page Not Found</h3>
            <p className="text-gray-400 max-w-md mb-8">
                The page you are looking for doesn't exist or has been moved to a new dimension.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-lg shadow-blue-500/20"
            >
                Return Home
            </Link>
        </div>
    )
}
