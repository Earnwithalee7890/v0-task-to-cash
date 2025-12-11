import { ImageResponse } from "@vercel/og"
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

        const res = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey || ""
                }
            }
        )

        const json = await res.json()
        const user = json.users?.[0]

        // Safely trying both common score locations to ensure we get a number if possible
        score = user?.experimental?.neynar_user_score ?? user?.score ?? 0
        // Round to integer for display
        score = Math.round(score * 100)

        username = user?.username ?? "user"
        reputation = user?.reputation ?? "Unknown"
    } catch (e) {
        // fallback values, never crash OG
        console.error("OG Error:", e)
    }

    const image = new ImageResponse(
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
                    fontFamily: "Inter",
                }}
            >
                <div style={{ fontSize: 160 }}>{score}</div>
                <div style={{ fontSize: 45 }}>@{username}</div>
                <div style={{ fontSize: 40, marginTop: 20 }}>{reputation}</div>
            </div>
        ),
        { width: 1200, height: 630 }
    )

    image.headers.set("Cache-Control", "no-store")
    return image
}
