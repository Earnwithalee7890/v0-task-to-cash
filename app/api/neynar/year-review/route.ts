import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const fid = searchParams.get("fid")

    if (!fid) {
        return NextResponse.json({ error: "FID is required" }, { status: 400 })
    }

    const apiKey = process.env.NEYNAR_API_KEY

    if (!apiKey) {
        // Return mock data for demo/development if no key
        return NextResponse.json({
            fid: Number.parseInt(fid),
            username: "demo_user",
            displayName: "Demo User",
            pfpUrl: "",
            score: 92,
            rank: "Top 1%",
            followers: 1205, // Mock follower count
            activeDays: 245,
            totalLikes: 1250,
            castsCount: 342,
            peakHour: 20,
            peakDay: "Friday",
            topCast: {
                text: "This is a demo cast text for the 2025 year review!",
                likes: 45,
                replies: 12,
                date: "2025-06-15"
            }
        })
    }

    try {
        // 1. Fetch User Details for Score and Followers
        const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                accept: "application/json",
                "x-api-key": apiKey,
            },
        })

        if (!userResponse.ok) throw new Error("Failed to fetch user")

        const userData = await userResponse.json()
        const user = userData.users?.[0]

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        // 2. Fetch Recent Casts (limit 150 for better sample of 2025)
        const castsResponse = await fetch(
            `https://api.neynar.com/v2/farcaster/feed/user/${fid}?limit=150`,
            {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                }
            }
        )

        let totalLikesInSample = 0
        let totalCastsInSample = 0
        let bestCast = null
        let maxEngagement = -1
        let peakHour = 12 // Default noon
        let peakDay = "Wednesday" // Default

        if (castsResponse.ok) {
            const castsData = await castsResponse.json()
            const casts = castsData.casts || []
            totalCastsInSample = casts.length

            // Time analysis buckets
            const hoursByCount = new Array(24).fill(0)
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const daysByCount = new Array(7).fill(0)

            // Aggregation on sample
            casts.forEach((cast: any) => {
                const likes = cast.reactions?.likes_count || 0
                const replies = cast.replies?.count || 0
                const engagement = likes + replies

                // Time analysis
                const date = new Date(cast.timestamp)
                const hour = date.getUTCHours() // Using UTC for consistency
                const day = date.getUTCDay()

                hoursByCount[hour]++
                daysByCount[day]++

                totalLikesInSample += likes

                if (engagement > maxEngagement) {
                    maxEngagement = engagement
                    bestCast = {
                        text: cast.text,
                        likes: likes,
                        replies: replies,
                        date: cast.timestamp,
                        hash: cast.hash
                    }
                }
            })

            // Find peak time
            let maxHourCount = -1
            hoursByCount.forEach((count, h) => {
                if (count > maxHourCount) {
                    maxHourCount = count
                    peakHour = h
                }
            })

            // Find peak day
            let maxDayCount = -1
            let peakDayIndex = 0
            daysByCount.forEach((count, d) => {
                if (count > maxDayCount) {
                    maxDayCount = count
                    peakDayIndex = d
                }
            })
            peakDay = dayNames[peakDayIndex]
        }

        const score = Math.round((user.experimental?.neynar_user_score ?? 0) * 100)

        // Exact follower count from user object (Accurate)
        const followers = user.follower_count || 0

        // Rank based on Power Badge or Score
        let rank = "Explorer"
        if (user.power_badge) rank = "Power User"
        else if (score >= 90) rank = "Top 1%"
        else if (score >= 80) rank = "Top 5%"
        else if (score >= 50) rank = "Top 25%"

        return NextResponse.json({
            fid: user.fid,
            username: user.username,
            displayName: user.display_name,
            pfpUrl: user.pfp_url,
            score: score,
            rank: rank,
            followers: followers, // Accurate
            activeDays: Math.min(totalCastsInSample, 365), // Proxy for activity
            totalLikes: totalLikesInSample, // Explicitly labeled as sample or "2025 Impact"
            topCast: bestCast,
            castsCount: totalCastsInSample,
            peakHour: peakHour,
            peakDay: peakDay
        })

    } catch (error) {
        console.error("Year Review API Error:", error)
        return NextResponse.json({ error: "Failed to fetch year review data" }, { status: 500 })
    }
}
