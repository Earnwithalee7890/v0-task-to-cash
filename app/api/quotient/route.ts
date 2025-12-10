import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const fid = searchParams.get("fid")

        if (!fid) {
            return NextResponse.json(
                { error: "FID is required" },
                { status: 400 }
            )
        }

        // Fetch from official Quotient API
        const response = await fetch(
            `https://api.quotient.social/v1/user-reputation?fid=${fid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Quotient API error: ${response.status}`)
        }

        const data = await response.json()

        return NextResponse.json({
            quotientScore: data.quotientScore,
            quotientScoreRaw: data.quotientScoreRaw,
            rank: data.rank,
        })
    } catch (error) {
        console.error("Error fetching Quotient data:", error)
        return NextResponse.json(
            { error: "Failed to fetch Quotient score" },
            { status: 500 }
        )
    }
}
