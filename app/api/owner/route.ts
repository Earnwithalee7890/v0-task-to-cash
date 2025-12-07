import { NextResponse } from "next/server"

export async function GET() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY
        if (!apiKey) {
            return NextResponse.json({ pfpUrl: null }, { status: 500 })
        }

        const response = await fetch("https://api.neynar.com/v2/farcaster/user/bulk?fids=338060", {
            headers: {
                "accept": "application/json",
                "api_key": apiKey
            }
        })

        if (!response.ok) {
            return NextResponse.json({ pfpUrl: null }, { status: response.status })
        }

        const data = await response.json()
        const users = data.users || []
        const pfpUrl = users[0]?.pfp_url || null

        return NextResponse.json({ pfpUrl })
    } catch (error) {
        console.error("Error fetching owner profile:", error)
        return NextResponse.json({ pfpUrl: null }, { status: 500 })
    }
}
