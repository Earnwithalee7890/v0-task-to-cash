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
        const scores = Array.isArray(data.scores) ? data.scores : []

        if (scores.length === 0) return null

        let builderScore = 0
        let creatorScore = 0
        let revenue = 0
        let handle = ""
        let isHuman = false
        let isVerified = false

        // Iterate through all scores to find specialized types
        scores.forEach((s: any) => {
            const type = String(s.score_type || "").toLowerCase()
            if (type === "builder") builderScore = s.score || 0
            if (type === "creator") creatorScore = s.score || 0

            // Extract common metadata from any of the score objects
            if (s.handle) handle = s.handle
            if (s.human_checkmark !== undefined) isHuman = !!s.human_checkmark
            if (s.verified !== undefined) isVerified = !!s.verified

            // Search for revenue data in data points or top level
            if (s.farcaster_revenue) revenue = s.farcaster_revenue
            if (s.revenue) revenue = s.revenue // Fallback name
        })

        return {
            id: String(fid),
            handle,
            builder_score: builderScore,
            creator_score: creatorScore,
            farcaster_revenue: revenue,
            human_checkmark: isHuman,
            verified: isVerified
        }
    } catch (error) {
        console.error("Error fetching Talent Protocol data:", error)
        return null
    }
}
