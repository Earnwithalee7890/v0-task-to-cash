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
export async function getTalentProtocolData(fid: number, wallets: string[] = [], fc_handle?: string): Promise<TalentProfileData | null> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

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
        let firstPassportData: any = null

        const promises: Promise<void>[] = []

        // STRATEGY 0: Passports Endpoint (v3 Most Reliable)
        const idents = [`farcaster:${fid}`, String(fid)]
        if (fc_handle) {
            idents.push(`farcaster:${fc_handle}`)
            idents.push(fc_handle)
        }

        idents.forEach(ident => {
            promises.push((async () => {
                try {
                    const res = await fetch(`${TALENT_API_BASE}/passports/${ident}`, { headers, signal: controller.signal })
                    if (res.ok) {
                        const data = await res.json()
                        const p = data.passport
                        if (p) {
                            if (!firstPassportData) firstPassportData = p
                            if (!profileId) profileId = p.id || p.main_wallet
                            if (!profileHandle) profileHandle = p.handle || p.username
                            profileHuman = profileHuman || !!p.human_checkmark
                            profileVerified = profileVerified || !!p.verified
                            if (Array.isArray(p.scores)) rawScores.push(...p.scores)
                        }
                    }
                } catch (e) {
                    console.log(`[TALENT] Passport Strategy (${ident}) failed`)
                }
            })())
        })

        // STRATEGY 1: Farcaster Scores Bulk (v3)
        promises.push((async () => {
            try {
                const res = await fetch(`${TALENT_API_BASE}/farcaster/scores?fids=${fid}`, { headers, signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    if (Array.isArray(data.scores)) rawScores.push(...data.scores)
                    if (data.profiles?.[0]) {
                        const p = data.profiles[0]
                        if (!profileId) profileId = p.id
                        if (!profileHandle) profileHandle = p.handle
                        if (Array.isArray(p.scores)) rawScores.push(...p.scores)
                    }
                }
            } catch (e) {
                console.log("[TALENT] Farcaster Scores Strategy failed")
            }
        })())

        // STRATEGY 2: Profiles Identity lookup
        const profileIdents = [`farcaster:${fid}`]
        if (fc_handle) profileIdents.push(`farcaster:${fc_handle}`)

        profileIdents.forEach(ident => {
            promises.push((async () => {
                try {
                    const res = await fetch(`${TALENT_API_BASE}/profiles?identity=${ident}`, { headers, signal: controller.signal })
                    if (res.ok) {
                        const data = await res.json()
                        const p = data.profile || data.profiles?.[0]
                        if (p) {
                            if (!profileId) profileId = p.id
                            if (!profileHandle) profileHandle = p.handle
                            if (Array.isArray(p.scores)) rawScores.push(...p.scores)
                        }
                    }
                } catch (e) {
                    console.log(`[TALENT] Profile Identity Strategy (${ident}) failed`)
                }
            })())
        })

        // STRATEGY 3: Wallet Passports
        wallets.slice(0, 3).forEach(wallet => {
            promises.push((async () => {
                try {
                    const res = await fetch(`${TALENT_API_BASE}/passports/${wallet}`, { headers, signal: controller.signal })
                    if (res.ok) {
                        const data = await res.json()
                        const p = data.passport
                        if (p) {
                            if (!profileId) profileId = p.id
                            if (!profileHandle) profileHandle = p.handle
                            if (Array.isArray(p.scores)) rawScores.push(...p.scores)
                        }
                    }
                } catch (e) {
                    console.log(`[TALENT] Wallet Passport Strategy (${wallet}) failed`)
                }
            })())
        })

        await Promise.all(promises)

        if (rawScores.length === 0) {
            console.warn(`[TALENT] No data found for FID ${fid} after all v3 strategies`)
            return null
        }

        let builderScore = 0
        let creatorScore = 0
        let revenue = 0

        rawScores.forEach((s: any) => {
            const slug = String(s.scorer_slug || s.score_type || s.name || s.slug || "").toLowerCase()
            const scoreVal = Number(s.points ?? s.score ?? s.value ?? s.score_value ?? 0)

            if (slug.includes("builder")) builderScore = Math.max(builderScore, scoreVal)
            if (slug.includes("creator")) creatorScore = Math.max(creatorScore, scoreVal)

            if (s.handle && !profileHandle) profileHandle = s.handle
            if (s.human_checkmark !== undefined) profileHuman = profileHuman || !!s.human_checkmark
            if (s.verified !== undefined) profileVerified = profileVerified || !!s.verified

            const revVal = Number(s.farcaster_revenue ?? s.revenue ?? s.total_rewards ?? 0)
            revenue = Math.max(revenue, revVal)
        })

        // FINAL FALLBACK: Check top-level fields if scores array was empty or failed
        if (builderScore === 0 || creatorScore === 0) {
            // We'll check the first successful p we got
            console.log(`[TALENT] Checking for top-level scores for FID ${fid}`)
            if (firstPassportData) {
                builderScore = Math.max(builderScore, Number(firstPassportData.builder_score ?? 0))
                creatorScore = Math.max(creatorScore, Number(firstPassportData.creator_score ?? 0))
                revenue = Math.max(revenue, Number(firstPassportData.farcaster_revenue ?? 0))
                profileHuman = profileHuman || !!firstPassportData.human_checkmark
                profileVerified = profileVerified || !!firstPassportData.verified
                if (!profileHandle) profileHandle = firstPassportData.handle || firstPassportData.username
                if (!profileId) profileId = firstPassportData.id || firstPassportData.main_wallet
            }
        }

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
        console.error("[TALENT] Fatal error in fetch:", error)
        return null
    } finally {
        clearTimeout(timeoutId)
    }
}
