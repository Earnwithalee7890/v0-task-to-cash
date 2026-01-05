import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fid = searchParams.get("fid")

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 })
  }

  const apiKey = process.env.NEYNAR_API_KEY

  if (!apiKey) {
    // Mock data for development without API key
    return NextResponse.json({
      fid: Number.parseInt(fid),
      username: "demo_user",
      displayName: "Demo User",
      pfpUrl: "/profile-avatar-crypto-user.jpg",
      score: 75,
      reputation: "neutral" as const,
      followers: 1234,
      following: 567,
      casts: 42,
      replies: 0,
      verifiedAddresses: [],
      activeStatus: "active",
      powerBadge: true,
      bio: "Demo user bio"
    })
  }

  try {
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      next: { revalidate: 300 } // Cache for 5 mins
    })

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user from Neynar")
    }

    const userData = await userResponse.json()
    const user = userData.users?.[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // --- SCORE & REPUTATION LOGIC ---
    const score = user.experimental?.neynar_user_score ?? 0
    const scorePercent = Math.round(score * 100)

    let reputation: "safe" | "neutral" | "risky" | "spammy" = "neutral"

    // Improved Reputation Logic
    if (scorePercent >= 80) reputation = "safe"
    else if (scorePercent >= 60) reputation = "safe"
    else if (scorePercent >= 40) reputation = "neutral"
    else if (scorePercent >= 20) reputation = "risky"
    else reputation = "spammy"

    if (user.active_status === "inactive" && scorePercent < 30) reputation = "spammy"


    // --- CASTS COUNT LOGIC ---
    let totalCasts = 0
    // Casting data is expensive/unreliable to fetch in bulk without specific plan
    // We will skip this for now to avoid "0" confusion or API limits
    // totalCasts = 0

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
      replies: 0,
      verifiedAddresses: user.verified_addresses?.eth_addresses ?? [],
      bio: user.profile?.bio?.text ?? "",
      activeStatus: user.active_status || "active", // Default to active if missing to avoid "everyone inactive"
      powerBadge: user.power_badge ?? false,
    })
  } catch (error) {
    console.error("Neynar API error:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
