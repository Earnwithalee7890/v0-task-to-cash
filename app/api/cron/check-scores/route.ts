import { type NextRequest, NextResponse } from "next/server"
import { getTalentProtocolData } from "@/lib/talent"
import { notifyScoreChange } from "@/lib/notifications"

/**
 * Vercel Cron Job Route
 * Frequency: Daily or Weekly
 * 
 * Note: This requires a database to store user FIDs and their last known scores.
 * The implementation below outlines the logic with placeholders for DB operations.
 */

export async function GET(request: NextRequest) {
    // 1. Verify Request (Optional: check for Vercel Cron header or API key)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        const apiKey = process.env.NEYNAR_API_KEY
        if (!apiKey) throw new Error("NEYNAR_API_KEY missing")

        // 2. Fetch all users from your DB
        // const users = await db.users.findMany()
        const mockUsers = [
            { fid: 338060, lastNeynarScore: 75 }, // Example: aleekhoso
        ]

        const results = []

        for (const user of mockUsers) {
            // 3. Fetch latest Neynar score
            const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${user.fid}`, {
                headers: { "x-api-key": apiKey }
            })

            if (!userResponse.ok) continue

            const neynarData = await userResponse.json()
            const userProfile = neynarData.users?.[0]
            const currentNeynarScore = Math.round((userProfile?.experimental?.neynar_user_score ?? 0) * 100)
            const eth_addresses = userProfile?.verified_addresses?.eth_addresses ?? []

            // 4. Check for change
            if (currentNeynarScore !== user.lastNeynarScore) {
                console.log(`Score changed for FID ${user.fid}: ${user.lastNeynarScore} -> ${currentNeynarScore}`)

                // Fetch latest Talent scores for richer notification
                const talentData = await getTalentProtocolData(user.fid, eth_addresses)

                // 5. Send Notification
                await notifyScoreChange(
                    user.fid,
                    user.lastNeynarScore,
                    currentNeynarScore,
                    talentData?.builder_score,
                    talentData?.creator_score
                )

                results.push({ fid: user.fid, status: "notified", old: user.lastNeynarScore, new: currentNeynarScore })
            } else {
                results.push({ fid: user.fid, status: "no_change" })
            }
        }

        return NextResponse.json({
            success: true,
            processed: mockUsers.length,
            results
        })
    } catch (error) {
        console.error("Cron Job Error:", error)
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
    }
}
