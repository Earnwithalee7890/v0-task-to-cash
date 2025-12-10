import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

// Fetch user data directly - can't import from lib in edge runtime
async function fetchUserScore(fid: number) {
    const apiKey = process.env.NEYNAR_API_KEY

    if (!apiKey) {
        return {
            username: "demo_user",
            displayName: "Demo User",
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
            }
        )

        if (!response.ok) throw new Error("API error")

        const data = await response.json()
        const user = data.users?.[0]

        if (!user) throw new Error("User not found")

        const rawScore = user.experimental?.neynar_user_score ?? 0
        const score = Math.round(rawScore * 100)

        let reputation = "neutral"
        if (score >= 80) reputation = "safe"
        else if (score >= 50) reputation = "neutral"
        else if (score >= 25) reputation = "risky"
        else reputation = "spammy"

        return {
            username: user.username || "user",
            displayName: user.display_name || user.username || "User",
            score,
            reputation,
        }
    } catch {
        return {
            username: "user",
            displayName: "User",
            score: 50,
            reputation: "neutral",
        }
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    // Primary: Use FID to fetch live data
    const fidParam = searchParams.get("fid")

    let score: string
    let username: string
    let displayName: string
    let reputation: string

    if (fidParam) {
        // Fetch live data from Neynar using FID
        const userData = await fetchUserScore(Number(fidParam))
        score = String(userData.score)
        username = userData.username
        displayName = userData.displayName
        reputation = userData.reputation
    } else {
        // Fallback: Use query params if provided (backwards compatibility)
        score = searchParams.get("score") || "0"
        username = searchParams.get("username") || "User"
        displayName = searchParams.get("displayName") || username
        reputation = searchParams.get("reputation") || "neutral"
    }

    // Determine colors based on score
    const scoreNum = parseInt(score)
    let gradientStart = "#ef4444"
    let gradientEnd = "#dc2626"
    let scoreColor = "#ffffff"

    if (scoreNum >= 80) {
        gradientStart = "#10b981"
        gradientEnd = "#059669"
    } else if (scoreNum >= 60) {
        gradientStart = "#f59e0b"
        gradientEnd = "#d97706"
    } else if (scoreNum >= 40) {
        gradientStart = "#3b82f6"
        gradientEnd = "#2563eb"
    }

    // Badge color based on reputation
    const badgeColors: Record<string, string> = {
        safe: "#10b981",
        neutral: "#a855f7",
        risky: "#f59e0b",
        spammy: "#ef4444",
    }

    const badgeColor = badgeColors[reputation] || badgeColors.neutral

    const imageResponse = new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
                    fontFamily: "Inter, sans-serif",
                    position: "relative",
                }}
            >
                {/* Animated Background Elements */}
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        background: `radial-gradient(circle at 30% 50%, ${gradientStart}15 0%, transparent 50%)`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        background: `radial-gradient(circle at 70% 50%, ${gradientEnd}15 0%, transparent 50%)`,
                    }}
                />

                {/* Main Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "32px",
                        zIndex: 10,
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: "flex",
                            fontSize: "36px",
                            fontWeight: "bold",
                            background: "linear-gradient(90deg, #00d9ff 0%, #00ffcc 100%)",
                            backgroundClip: "text",
                            color: "transparent",
                            letterSpacing: "0.1em",
                        }}
                    >
                        TRUESCORE
                    </div>

                    {/* Score Display - Large and Prominent */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: "180px",
                                fontWeight: "bold",
                                background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                                backgroundClip: "text",
                                color: "transparent",
                                lineHeight: 1,
                            }}
                        >
                            {score}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: "24px",
                                color: "rgba(255,255,255,0.6)",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            Neynar Score
                        </div>
                    </div>

                    {/* User Info */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: "32px",
                                fontWeight: "600",
                                color: "#ffffff",
                            }}
                        >
                            {displayName}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: "20px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            @{username}
                        </div>
                    </div>

                    {/* Reputation Badge - Subtle */}
                    <div
                        style={{
                            display: "flex",
                            padding: "10px 28px",
                            borderRadius: "999px",
                            background: `${badgeColor}20`,
                            border: `2px solid ${badgeColor}`,
                            color: badgeColor,
                            fontSize: "18px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        {reputation}
                    </div>
                </div>

                {/* Footer - Minimal */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        display: "flex",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                    }}
                >
                    Get your score at TrueScore
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )

    // Add cache-control headers to prevent caching
    imageResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    imageResponse.headers.set('CDN-Cache-Control', 'no-store')
    imageResponse.headers.set('Vercel-CDN-Cache-Control', 'no-store')

    return imageResponse
}
