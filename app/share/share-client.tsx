"use client"

import { useEffect, useState } from 'react'
import sdk from "@farcaster/frame-sdk"
import { useRouter, useSearchParams } from 'next/navigation'

export default function ShareClient() {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const init = async () => {
            // Short delay to allow Farcaster to process the initial frame
            await new Promise(resolve => setTimeout(resolve, 100))

            const fid = searchParams.get('fid')
            if (fid) {
                // Redirect to home with the FID so it can display that user's score
                window.location.href = `/?fid=${fid}`
            } else {
                window.location.href = `/`
            }
        }

        init()
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading score...</p>
            </div>
        </div>
    )
}
