"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
            <p className="text-gray-400 mb-8 max-w-md">
                An unexpected error occurred. Our engineers have been notified.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-lg"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all border border-gray-700"
                >
                    Go back home
                </Link>
            </div>
        </div>
    )
}
