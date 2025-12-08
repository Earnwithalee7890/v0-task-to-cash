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
    let scoreColor = "#f87171" // red for low
    let glowColor = "rgba(248, 113, 113, 0.4)"

    if (scoreNum >= 80) {
        scoreColor = "#4ade80" // green
        glowColor = "rgba(74, 222, 128, 0.4)"
    } else if (scoreNum >= 60) {
        scoreColor = "#facc15" // yellow
        glowColor = "rgba(250, 204, 21, 0.4)"
    } else if (scoreNum >= 40) {
        scoreColor = "#38bdf8" // blue
        glowColor = "rgba(56, 189, 248, 0.4)"
    }

    // Badge color based on reputation
    const badgeColors: Record<string, { bg: string; text: string }> = {
        safe: { bg: "#22c55e", text: "#ffffff" },
        neutral: { bg: "#a855f7", text: "#ffffff" },
        risky: { bg: "#f97316", text: "#ffffff" },
        spammy: { bg: "#ef4444", text: "#ffffff" },
    }

    const badge = badgeColors[reputation] || badgeColors.neutral

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                {/* Glow effect */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: glowColor,
                        filter: "blur(100px)",
                    }}
                />

                {/* TrueScore Logo/Title */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#ffffff",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        TrueScore
                    </div>
                </div>

                {/* Score Circle */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "220px",
                        height: "220px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `8px solid ${scoreColor}`,
                        boxShadow: `0 0 60px ${glowColor}`,
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "72px",
                                fontWeight: "bold",
                                color: scoreColor,
                                lineHeight: 1,
                                textShadow: `0 0 30px ${glowColor}`,
                            }}
                        >
                            {score}
                        </span>
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                                marginTop: "8px",
                            }}
                        >
                            Neynar Score
                        </span>
                    </div>
                </div>

                {/* User info */}
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
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#ffffff",
                        }}
                    >
                        {displayName}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "16px",
                            color: "rgba(255,255,255,0.5)",
                        }}
                    >
                        @{username}
                    </div>
                </div>

                {/* Reputation Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                        padding: "8px 20px",
                        borderRadius: "999px",
                        background: badge.bg,
                        color: badge.text,
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {reputation}
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "14px",
                    }}
                >
                    Check your score at v0-task-to-cash-seven.vercel.app
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
