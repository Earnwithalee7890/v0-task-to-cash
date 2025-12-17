/**
 * Neynar Notification Utility
 * Provides functions to send push notifications to Mini App users
 */

const NEYNAR_API_BASE = "https://api.neynar.com/f/app"

interface NotificationPayload {
    target_fids?: number[]
    notification: {
        title: string
        body: string
        target_url: string
    }
}

/**
 * Send a notification to specific users (or all users if target_fids is empty)
 */
export async function sendNeynarNotification(payload: NotificationPayload) {
    try {
        const apiKey = process.env.NEYNAR_API_KEY
        const clientId = process.env.NEYNAR_CLIENT_ID

        if (!apiKey || !clientId) {
            console.warn("NEYNAR_API_KEY or NEYNAR_CLIENT_ID is not set")
            return null
        }

        const response = await fetch(`${NEYNAR_API_BASE}/${clientId}/notifications`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                target_fids: payload.target_fids || [], // Empty array targets all users who enabled notifications
                notification: payload.notification
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Neynar Notification error:", errorData)
            return null
        }

        return await response.json()
    } catch (error) {
        console.error("Error sending Neynar notification:", error)
        return null
    }
}

/**
 * Convenience function to notify about a score change
 */
export async function notifyScoreChange(fid: number, oldScore: number, newScore: number, builderScore?: number, creatorScore?: number) {
    const direction = newScore > oldScore ? "increased" : "decreased"
    const diff = Math.abs(newScore - oldScore)

    let body = `Your Neynar score ${direction} by ${diff} points.`
    if (builderScore !== undefined || creatorScore !== undefined) {
        body += `\nBuilder: ${builderScore || 0} | Creator: ${creatorScore || 0}`
    }
    body += `\nTap to see your full reputation report.`

    return sendNeynarNotification({
        target_fids: [fid],
        notification: {
            title: "Your TrueScore Updated!",
            body: body,
            target_url: "https://v0-task-to-cash-seven.vercel.app/"
        }
    })
}
