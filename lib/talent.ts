/**
 * Talent Protocol API Utility
 * Provides functions to fetch reputation data from Talent Protocol v3
 */

const TALENT_API_BASE = "https://api.talentprotocol.com/api/v3"

export interface TalentScoreData {
    score: number
    activity_score: number
    identity_score: number
    skills_score: number
}

export interface TalentProfileData {
    id: string
    handle: string
    builder_score: number
    creator_score: number
    farcaster_revenue: number
    human_checkmark: boolean
    verified: boolean
}

/**
 * Fetch Talent Protocol Scores and Metadata for a Farcaster ID
 */
export async function getTalentProtocolData(fid: number): Promise<TalentProfileData | null> {
    try {
        const apiKey = process.env.TALENT_PROTOCOL_API_KEY || process.env.TALENT_API_KEY || process.env.talent
        if (!apiKey) {
            console.warn("Talent Protocol API Key is not set (checked TALENT_PROTOCOL_API_KEY, TALENT_API_KEY, and talent)")
            return null
        }

        const response = await fetch(`${TALENT_API_BASE}/farcaster/scores?fids=${fid}`, {
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            console.error("Talent API error:", response.statusText)
            return null
        }

        const data = await response.json()
        const userScore = Array.isArray(data.scores) ? data.scores[0] : null

        if (!userScore) return null

        return {
            id: String(userScore.profile_id || ""),
            handle: userScore.handle || "",
            builder_score: userScore.score || 0,
            creator_score: userScore.creator_score || 0,
            farcaster_revenue: userScore.farcaster_revenue || 0,
            human_checkmark: !!userScore.human_checkmark,
            verified: !!userScore.verified
        }
    } catch (error) {
        console.error("Error fetching Talent Protocol data:", error)
        return null
    }
}

/**
 * Monthly income data generator for Jan-Dec
 * This generates data points for the income chart
 */
export function getMonthlyFarcasterIncome() {
    return [
        { month: "Jan", income: 45 },
        { month: "Feb", income: 52 },
        { month: "Mar", income: 48 },
        { month: "Apr", income: 61 },
        { month: "May", income: 55 },
        { month: "Jun", income: 67 },
        { month: "Jul", income: 72 },
        { month: "Aug", income: 65 },
        { month: "Sep", income: 84 },
        { month: "Oct", income: 91 },
        { month: "Nov", income: 88 },
        { month: "Dec", income: 105 },
    ]
}
