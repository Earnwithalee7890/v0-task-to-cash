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

        // STRATEGY 1: FID Score
        promises.push((async () => {
            try {
                const res = await fetch(`${TALENT_API_BASE}/farcaster/scores?fids=${fid}`, { headers, signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    if (data.scores) rawScores.push(...data.scores)
                    else if (data.profiles?.[0]?.scores) {
                        const p = data.profiles[0]
                        rawScores.push(...p.scores)
                        if (!profileId) profileId = p.id
                        if (!profileHandle) profileHandle = p.handle || p.username
                    }
                }
            } catch (e) {
                console.log("[TALENT] Strategy 1 failed or timed out")
            }
        })())

        // STRATEGY 2: Identity Search
        promises.push((async () => {
            try {
                const searchUrl = `${TALENT_API_BASE}/search/advanced/profiles?query=${encodeURIComponent(JSON.stringify({ identity: `farcaster:${fid}`, exactMatch: true }))}`
                const res = await fetch(searchUrl, { headers, signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    const p = data.profiles?.[0]
                    if (p) {
                        if (!profileId) profileId = p.id
                        if (!profileHandle) profileHandle = p.handle || p.username
                        profileHuman = profileHuman || !!p.human_checkmark
                        profileVerified = profileVerified || !!p.verified
                        if (p.scores) rawScores.push(...p.scores)
                    }
                }
            } catch (e) {
                console.log("[TALENT] Strategy 2 failed or timed out")
            }
        })())

        // STRATEGY 3: Wallet Search (First 3 wallets only for speed)
        const topWallets = wallets.slice(0, 3)
        topWallets.forEach(wallet => {
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
