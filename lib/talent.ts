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
 * Fetch Talent Protocol Scores and Metadata for a Farcaster ID or Wallets
 */
export async function getTalentProtocolData(fid: number, wallets: string[] = []): Promise<TalentProfileData | null> {
    try {
        const apiKey = process.env.TALENT_PROTOCOL_API_KEY || process.env.TALENT_API_KEY || process.env.talent
        if (!apiKey) {
            console.warn("Talent Protocol API Key is not set")
            return null
        }

        let rawScores: any[] = []
        let profileHandle = ""
        let profileHuman = false
        let profileVerified = false

        // 1. Try fetching by FID first
        console.log(`[DEBUG] Attempting Talent API fetch for FID: ${fid}`)
        const fidResponse = await fetch(`${TALENT_API_BASE}/farcaster/scores?fids=${fid}`, {
            headers: {
                "X-API-KEY": apiKey,
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        })

        if (fidResponse.ok) {
            const data = await fidResponse.json()
            if (Array.isArray(data.scores)) rawScores.push(...data.scores)
        }

        // 2. Fallback to Wallets if FID returned nothing or to enrich data
        if (rawScores.length === 0 && wallets.length > 0) {
            console.log(`[DEBUG] No scores for FID, trying wallets: ${wallets.join(', ')}`)
            for (const wallet of wallets) {
                const walletResponse = await fetch(`${TALENT_API_BASE}/scores?id=${wallet}`, {
                    headers: {
                        "X-API-KEY": apiKey,
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                })
                if (walletResponse.ok) {
                    const data = await walletResponse.json()
                    // The wallet endpoint usually returns a single profile with a scores array
                    if (data.profile) {
                        if (data.profile.handle) profileHandle = data.profile.handle
                        if (data.profile.human_checkmark) profileHuman = true
                        if (data.profile.verified) profileVerified = true
                    }
                    if (Array.isArray(data.scores)) rawScores.push(...data.scores)
                    if (rawScores.length > 0) break // Found data
                }
            }
        }

        if (rawScores.length === 0) {
            console.warn(`[DEBUG] No Talent Protocol data found for FID ${fid} or Wallets`)
            return null
        }

        console.log(`[DEBUG] Raw Talent Scores count: ${rawScores.length}`)

        let builderScore = 0
        let creatorScore = 0
        let revenue = 0

        rawScores.forEach((s: any) => {
            // Documented slugs are 'builder' and 'creator'
            const slug = String(s.scorer_slug || s.score_type || "").toLowerCase()
            const scoreVal = Number(s.score ?? s.value ?? s.points ?? 0)

            console.log(`[DEBUG] Found score - Slug: ${slug}, Value: ${scoreVal}`)

            if (slug.includes("builder")) {
                builderScore = Math.max(builderScore, scoreVal)
            } else if (slug.includes("creator")) {
                creatorScore = Math.max(creatorScore, scoreVal)
            }

            // Extract profile metadata if available at top level of score object
            if (s.handle) profileHandle = s.handle
            if (s.human_checkmark !== undefined) profileHuman = !!s.human_checkmark
            if (s.verified_checkmark !== undefined) profileVerified = !!s.verified_checkmark
            if (s.verified !== undefined) profileVerified = !!s.verified

            const revVal = Number(s.farcaster_revenue ?? s.revenue ?? s.total_rewards ?? 0)
            revenue = Math.max(revenue, revVal)
        })

        return {
            id: String(fid),
            handle: profileHandle,
            builder_score: builderScore,
            creator_score: creatorScore,
            farcaster_revenue: revenue,
            human_checkmark: profileHuman,
            verified: profileVerified
        }
    } catch (error) {
        console.error("Error fetching Talent Protocol data:", error)
        return null
    }
}
