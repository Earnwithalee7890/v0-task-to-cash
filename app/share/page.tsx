"use client"

import { useEffect, useState } from 'react'
import sdk from "@farcaster/frame-sdk"

export default function SharePage() {
    const [fid, setFid] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            try {
                const context = await sdk.context
                const userFid = context?.user?.fid

                if (userFid) {
                    setFid(userFid)
                } else {
                    // Default to owner if no user context
                    setFid(338060)
                }
            } catch (error) {
                console.error('Error getting user context:', error)
                setFid(338060)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    useEffect(() => {
        if (fid && !loading) {
            // Redirect to home - the home page will load the correct user's score
            window.location.href = `/`
        }
    }, [fid, loading])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading your score...</p>
                </div>
            </div>
        )
    }

    return null
}
