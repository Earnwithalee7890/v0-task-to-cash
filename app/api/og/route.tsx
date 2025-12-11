import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

async function fetchUserScore(fid: number) {
    const apiKey = process.env.NEYNAR_API_KEY

    try {
        const res = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey || ""
                }
            }
        )

        // Robust error handling - fallback to neutral if API fails
        if (!res.ok) {
            console.error(`Neynar API Error: ${res.status} ${res.statusText}`)
            return {
                score: 0,
                reputation: "UNKNOWN",
                username: "user",
                displayName: "User"
            }
        }

        const data = await res.json()
        const user = data.users?.[0]

        // Safely access score. Fallback sequence: experimental.neynar_user_score -> score -> 0
        const rawScore = user?.experimental?.neynar_user_score ?? user?.score ?? 0
        const score = Math.round(rawScore * 100)

        // Safely access reputation
        const reputation = typeof user?.reputation === 'string'
            ? user.reputation.toUpperCase()
            : (score >= 50 ? "NEUTRAL" : "RISKY") // Simple fallback calc

        const username = user?.username || "user"
        const displayName = user?.display_name || username

        return { score, reputation, username, displayName }
    } catch (err) {
        console.error("fetchUserScore Exception:", err)
        return {
            score: 0,
            reputation: "UNKNOWN",
            username: "user",
            displayName: "User"
        }
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const fidParam = searchParams.get("fid")
        const fid = fidParam ? Number(fidParam) : 0

        const user = await fetchUserScore(fid)

        const image = new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #0a0e27, #1a1f3a)",
                        color: "white",
                        fontFamily: "Inter, sans-serif"
                    }}
                >
                    <div style={{ fontSize: 60, opacity: 0.8 }}>TRUESCORE</div>
                    <div style={{ fontSize: 200, fontWeight: "bold" }}>
                        {user.score}
                    </div>
                    <div style={{ fontSize: 50, marginTop: 10 }}>
                        @{user.username}
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            padding: "10px 30px",
                            borderRadius: 50,
                            border: "2px solid #ffffff40",
                            marginTop: 20
                        }}
                    >
                        {user.reputation}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )

        image.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
        image.headers.set("CDN-Cache-Control", "no-store")
        image.headers.set("Vercel-CDN-Cache-Control", "no-store")

        return image
    } catch (e: any) {
        console.error("OG Route Error:", e)
        return new Response(`Generative Error: ${e.message}`, { status: 500 })
    }
}
