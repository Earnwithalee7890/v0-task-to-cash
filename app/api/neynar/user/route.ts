import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fid = searchParams.get("fid")

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 })
  }

  const apiKey = process.env.NEYNAR_API_KEY

  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json({
      fid: Number.parseInt(fid),
      username: "demo_user",
      displayName: "Demo User",
      pfpUrl: "/profile-avatar-crypto-user.jpg",
      score: 75,
      reputation: "neutral" as const,
      followers: 1234,
      following: 567,
      casts: 0,
      replies: 0,
      verifiedAddresses: [],
    })
  }

  try {
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user from Neynar")
    }

    const userData = await userResponse.json()
    const user = userData.users?.[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const score = user.experimental?.neynar_user_score ?? 0
    const scorePercent = Math.round(score * 100)

    let reputation: "safe" | "neutral" | "risky" | "spammy" = "neutral"
    if (scorePercent >= 80) reputation = "safe"
    else if (scorePercent >= 50) reputation = "neutral"
    else if (scorePercent >= 25) reputation = "risky"
    else reputation = "spammy"

    // Fetch user's casts to count total casts and replies
    let totalCasts = 0
    let totalReplies = 0

    try {
      const castsResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/feed/user/${fid}?limit=150`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
        }
      )

      if (castsResponse.ok) {
        const castsData = await castsResponse.json()
        const casts = castsData.casts || []

        // Count casts and replies
        casts.forEach((cast: any) => {
          if (cast.parent_hash || cast.parent_url) {
            totalReplies++
          } else {
            totalCasts++
          }
        })
      }
    } catch (err) {
      console.error("Error fetching casts:", err)
      // Continue with 0 counts if casts fetch fails
    }

    // Fetch Talent Protocol data
    let talentData = null
    try {
      const { getTalentProtocolData } = await import("@/lib/talent")
      talentData = await getTalentProtocolData(Number.parseInt(fid))
    } catch (err) {
      console.error("Error fetching Talent Protocol data:", err)
    }

    return NextResponse.json({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      score: scorePercent,
      reputation,
      followers: user.follower_count ?? 0,
      following: user.following_count ?? 0,
      casts: totalCasts,
      replies: totalReplies,
      verifiedAddresses: user.verified_addresses?.eth_addresses ?? [],
      talentScore: talentData?.builder_score,
      creatorScore: talentData?.creator_score,
      farcasterRevenue: talentData?.farcaster_revenue,
      isHuman: talentData?.human_checkmark,
      isVerified: talentData?.verified,
      talentHandle: talentData?.handle
    })
  } catch (error) {
    console.error("Neynar API error:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
