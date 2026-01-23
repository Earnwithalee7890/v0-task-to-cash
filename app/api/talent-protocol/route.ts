import { NextRequest, NextResponse } from "next/server"

const TALENT_API_BASE = "https://api.talentprotocol.com"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const walletAddress = searchParams.get("wallet")
        const fid = searchParams.get("fid")

        if (!walletAddress && !fid) {
            return NextResponse.json(
                { error: "Either wallet address or FID is required" },
                { status: 400 }
            )
        }

        // Determine the ID and account source
        const id = walletAddress || fid
        const accountSource = fid ? "farcaster" : "wallet"

        // Fetch builder score
        const scoreUrl = `${TALENT_API_BASE}/score?id=${id}&account_source=${accountSource}&scorer_slug=builder-score`
        const scoreResponse = await fetch(scoreUrl, {
            headers: {
                "X-API-KEY": process.env.TALENT_PROTOCOL_API_KEY || "",
            },
        })

        if (!scoreResponse.ok) {
            // If no score found, return null data instead of error
            if (scoreResponse.status === 404) {
                return NextResponse.json({
                    score: null,
                    rank: null,
                    credentials: [],
                    hasProfile: false,
                })
            }
            throw new Error(`Talent Protocol API error: ${scoreResponse.status}`)
        }

        const scoreData = await scoreResponse.json()

        // Fetch credentials (breakdown of score)
        const credentialsUrl = `${TALENT_API_BASE}/credentials?id=${id}&account_source=${accountSource}`
        const credentialsResponse = await fetch(credentialsUrl, {
            headers: {
                "X-API-KEY": process.env.TALENT_PROTOCOL_API_KEY || "",
            },
        })

        let credentials = []
        if (credentialsResponse.ok) {
            const credentialsData = await credentialsResponse.json()
            credentials = credentialsData.credentials || []
        }

        // Extract key metrics from credentials
        const baseContracts = credentials.find((c: any) =>
            c.name?.toLowerCase().includes("base") && c.name?.toLowerCase().includes("contract")
        )?.points || 0

        const baseCommits = credentials.find((c: any) =>
            c.name?.toLowerCase().includes("base") && c.name?.toLowerCase().includes("github")
        )?.points || 0

        const githubContributions = credentials.find((c: any) =>
            c.name?.toLowerCase().includes("github") && !c.name?.toLowerCase().includes("base")
        )?.points || 0

        const farcasterActivity = credentials.find((c: any) =>
            c.name?.toLowerCase().includes("farcaster")
        )?.points || 0

        return NextResponse.json({
            score: scoreData.points || 0,
            rank: scoreData.rank_position || null,
            lastCalculated: scoreData.last_calculated_at,
            credentials: credentials.slice(0, 10), // Top 10 credentials
            hasProfile: true,
            metrics: {
                baseContracts,
                baseCommits,
                githubContributions,
                farcasterActivity,
            },
            profileUrl: `https://passport.talentprotocol.com/${id}`,
        })
    } catch (error) {
        console.error("Talent Protocol API error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch Talent Protocol data",
                score: null,
                rank: null,
                credentials: [],
                hasProfile: false,
            },
            { status: 500 }
        )
    }
}
