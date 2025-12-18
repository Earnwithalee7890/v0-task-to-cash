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

export interface TalentScoreLevel {
    level: number
    name: string
    color: string
}

export function getScoreLevel(score: number): TalentScoreLevel {
    if (score >= 250) return { level: 6, name: "Master", color: "text-amber-400" }
    if (score >= 170) return { level: 5, name: "Expert", color: "text-purple-400" }
    if (score >= 120) return { level: 4, name: "Advanced", color: "text-blue-400" }
    if (score >= 80) return { level: 3, name: "Practitioner", color: "text-green-400" }
    if (score >= 40) return { level: 2, name: "Apprentice", color: "text-orange-400" }
    return { level: 1, name: "Novice", color: "text-gray-400" }
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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s total timeout

    try {
        const apiKey = process.env.TALENT_PROTOCOL_API_KEY || process.env.TALENT_API_KEY || process.env.talent
        if (!apiKey) {
            console.warn("Talent Protocol API Key is not set")
            return null
        }

        const headers = {
            "X-API-KEY": apiKey,
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }

        const rawScores: any[] = []
        let profileHandle = ""
        let profileHuman = false
        let profileVerified = false
        let profileId = ""

        // Prepare parallel requests
        const promises: Promise<void>[] = []

        // STRATEGY 0: Direct Profile Lookup by FID (v3)
        promises.push((async () => {
            try {
                // Try multiple identity formats
                const idents = [`farcaster:${fid}`, String(fid)]
                for (const ident of idents) {
                    const res = await fetch(`${TALENT_API_BASE}/profiles?identity=${ident}`, { headers, signal: controller.signal })
                    if (res.ok) {
                        const data = await res.json()
                        const p = data.profile || data.profiles?.[0]
                        if (p) {
                            if (!profileId) profileId = p.id
                            if (!profileHandle) profileHandle = p.handle || p.username
                            profileHuman = profileHuman || !!p.human_checkmark
                            profileVerified = profileVerified || !!p.verified
                            if (p.scores) rawScores.push(...p.scores)
                            break
                        }
                    }
                }
            } catch (e) {
                console.log("[TALENT] Strategy 0 failed")
            }
        })())

        // STRATEGY 1: FID Score (v3 array format)
        promises.push((async () => {
            try {
                const res = await fetch(`${TALENT_API_BASE}/farcaster/scores?fids[]=${fid}`, { headers, signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    if (Array.isArray(data.scores)) rawScores.push(...data.scores)

                    // If metadata is inside a profile object
                    const p = data.profiles?.[0]
                    if (p) {
                        if (!profileId) profileId = p.id
                        if (!profileHandle) profileHandle = p.handle || p.username
                        profileHuman = profileHuman || !!p.human_checkmark
                    }
                }
            } catch (e) {
                console.log("[TALENT] Strategy 1 failed")
            }
        })())

        // STRATEGY 2: Identity Search (v3 query format)
        promises.push((async () => {
            try {
                const searchRes = await fetch(`${TALENT_API_BASE}/search?query=farcaster:${fid}`, { headers, signal: controller.signal })
                if (searchRes.ok) {
                    const data = await searchRes.json()
                    const p = data.profiles?.[0]
                    if (p) {
                        if (!profileId) profileId = p.id
                        if (!profileHandle) profileHandle = p.handle || p.username
                        if (p.scores) rawScores.push(...p.scores)
                    }
                }
            } catch (e) {
                console.log("[TALENT] Strategy 2 failed")
            }
        })())

        // STRATEGY 3: Wallet Search (All wallets, parallelized)
        wallets.slice(0, 5).forEach(wallet => {
            promises.push((async () => {
                try {
                    const res = await fetch(`${TALENT_API_BASE}/scores?id=${wallet}`, { headers, signal: controller.signal })
                    if (res.ok) {
                        const data = await res.json()
                        if (data.profile) {
                            if (!profileId) profileId = data.profile.id
                            if (!profileHandle) profileHandle = data.profile.handle
                            profileHuman = profileHuman || !!data.profile.human_checkmark
                        }
                        if (data.scores) rawScores.push(...data.scores)
                    }
                } catch (e) {
                    console.log(`[TALENT] Strategy 3 (${wallet}) failed or timed out`)
                }
            })())
        })

        await Promise.all(promises)
        clearTimeout(timeoutId)

        if (rawScores.length === 0) {
            console.warn(`[TALENT] No data found for FID ${fid} after parallel fetch`)
            return null
        }

        let builderScore = 0
        let creatorScore = 0
        let revenue = 0

        rawScores.forEach((s: any) => {
            const slug = String(s.scorer_slug || s.score_type || "").toLowerCase()
            const scoreVal = Number(s.points ?? s.score ?? s.value ?? 0)

            if (slug.includes("builder")) {
                builderScore = Math.max(builderScore, scoreVal)
            } else if (slug.includes("creator")) {
                creatorScore = Math.max(creatorScore, scoreVal)
            }

            if (s.handle && !profileHandle) profileHandle = s.handle
            if (s.human_checkmark !== undefined) profileHuman = profileHuman || !!s.human_checkmark
            if (s.verified !== undefined) profileVerified = profileVerified || !!s.verified

            const revVal = Number(s.farcaster_revenue ?? s.revenue ?? s.total_rewards ?? 0)
            revenue = Math.max(revenue, revVal)
        })

        return {
            id: profileId || String(fid),
            handle: profileHandle,
            builder_score: builderScore,
            creator_score: creatorScore,
            farcaster_revenue: revenue,
            human_checkmark: profileHuman,
            verified: profileVerified
        }
    } catch (error) {
        console.error("[TALENT] Fatal error in parallel fetch:", error)
        return null
    } finally {
        clearTimeout(timeoutId)
    }
}
