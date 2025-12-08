/**
 * Neynar API helper functions for fetching user reputation data
 */

export interface UserScoreData {
    fid: number
    username: string
    displayName: string
    pfpUrl: string
    score: number
    reputation: "safe" | "neutral" | "risky" | "spammy"
}

/**
 * Fetch user's Neynar score and reputation by FID
 * Used by OG image generation and share pages
 */
export async function getUserScore(fid: number): Promise<UserScoreData> {
    const apiKey = process.env.NEYNAR_API_KEY

    // Fallback data if no API key
    if (!apiKey) {
        return {
            fid,
            username: "demo_user",
            displayName: "Demo User",
            pfpUrl: "",
            score: 75,
            reputation: "neutral",
        }
    }

    try {
        const response = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                },
                // Cache for 60 seconds to avoid hitting rate limits
                next: { revalidate: 60 },
            }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch user from Neynar")
        }

        const data = await response.json()
        const user = data.users?.[0]

        if (!user) {
            throw new Error("User not found")
        }

        // Extract and calculate score
        const rawScore = user.experimental?.neynar_user_score ?? 0
        const score = Math.round(rawScore * 100)

        // Determine reputation based on score
        let reputation: UserScoreData["reputation"] = "neutral"
        if (score >= 80) reputation = "safe"
        else if (score >= 50) reputation = "neutral"
        else if (score >= 25) reputation = "risky"
        else reputation = "spammy"

        return {
            fid: user.fid,
            username: user.username || "user",
            displayName: user.display_name || user.username || "User",
            pfpUrl: user.pfp_url || "",
            score,
            reputation,
        }
    } catch (error) {
        console.error("Neynar API error:", error)
        // Return fallback data on error
        return {
            fid,
            username: "user",
            displayName: "User",
            pfpUrl: "",
            score: 50,
            reputation: "neutral",
        }
    }
}
