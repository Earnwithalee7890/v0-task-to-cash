import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const fid = Number(searchParams.get("fid")) || 0

    let score = 0
    let username = "user"
    let reputation = "Unknown"

    try {
        const apiKey = process.env.NEYNAR_API_KEY
        // Only fetch if FID is valid to avoid unnecessary API calls
        if (fid > 0) {
            const res = await fetch(
                `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
                {
                    headers: {
                        accept: "application/json",
                        "x-api-key": apiKey || ""
                    }
                }
            )

            if (res.ok) {
                const json = await res.json()
                const user = json.users?.[0]

                // Safely trying both common score locations
                score = user?.experimental?.neynar_user_score ?? user?.score ?? 0
                score = Math.round(score * 100)

                username = user?.username ?? "user"
                reputation = user?.reputation ?? "Unknown"
            }
        }
    } catch (e) {
        console.error("OG Error:", e)
        // Only log, do not crash. Variables will have default values.
    }

    // Determine background color based on reputation/score for visual feedback
    // (Optional: keep it black for safety as requested, or add subtle gradient)
    // Keeping it strict black as per "crash proof" request.

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "sans-serif", // Fallback to safe font
                }}
            >
                <div style={{ fontSize: 160, fontWeight: 'bold' }}>{score}</div>
                <div style={{ fontSize: 45, opacity: 0.8 }}>@{username}</div>
                <div style={{ fontSize: 40, marginTop: 20, padding: '5px 20px', border: '1px solid #333', borderRadius: 20 }}>{reputation}</div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            // Disable emoji/fonts loading for maximum safety if requested, 
            // but standard ImageResponse handles them well.
        }
    )
}
