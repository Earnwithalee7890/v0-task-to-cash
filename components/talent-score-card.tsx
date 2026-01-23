"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Trophy, TrendingUp, GitBranch, Code, Award } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TalentScoreData {
    score: number | null
    rank: number | null
    lastCalculated: string
    credentials: Array<{
        category: string
        name: string
        readable_value: string
        points: number
    }>
    hasProfile: boolean
    metrics: {
        baseContracts: number
        baseCommits: number
        githubContributions: number
        farcasterActivity: number
    }
    profileUrl: string
}

interface TalentScoreCardProps {
    walletAddress?: string
    fid?: number
    className?: string
}

export function TalentScoreCard({ walletAddress, fid, className = "" }: TalentScoreCardProps) {
    const [talentData, setTalentData] = useState<TalentScoreData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTalentScore = async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams()
                if (walletAddress) params.append("wallet", walletAddress)
                if (fid) params.append("fid", fid.toString())

                const response = await fetch(`/api/talent-protocol?${params.toString()}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch Talent Protocol data")
                }

                setTalentData(data)
            } catch (err) {
                console.error("Error fetching Talent Protocol data:", err)
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        if (walletAddress || fid) {
            fetchTalentScore()
        } else {
            setLoading(false)
        }
    }, [walletAddress, fid])

    if (loading) {
        return (
            <div className={`glass-card p-6 space-y-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        )
    }

    if (error || !talentData?.hasProfile || talentData?.score === null) {
        return (
            <div className={`glass-card p-6 border border-white/5 ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <Trophy className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Talent Protocol</h3>
                        <p className="text-xs text-muted-foreground">Builder Reputation</p>
                    </div>
                </div>
                <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                        No Talent Protocol profile found.
                    </p>
                    <a
                        href="https://passport.talentprotocol.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        Create Your Profile <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>
        )
    }

    const { score, rank, metrics, profileUrl } = talentData

    return (
        <div className={`glass-card p-6 border border-purple-500/20 ${className} opacity-0 animate-slide-up`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 box-glow-purple">
                        <Trophy className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Talent Protocol</h3>
                        <p className="text-xs text-muted-foreground">Builder Score</p>
                    </div>
                </div>
                <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-purple-500/10 transition-colors"
                    title="View on Talent Protocol"
                >
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                </a>
            </div>

            {/* Score Display */}
            <div className="mb-6 text-center">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {score?.toLocaleString() || 0}
                    </div>
                </div>
                {rank && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>Rank #{rank.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                    icon={<Code className="h-4 w-4" />}
                    label="Base Contracts"
                    value={metrics.baseContracts}
                    color="cyan"
                />
                <MetricCard
                    icon={<GitBranch className="h-4 w-4" />}
                    label="Base Commits"
                    value={metrics.baseCommits}
                    color="green"
                />
                <MetricCard
                    icon={<GitBranch className="h-4 w-4" />}
                    label="GitHub"
                    value={metrics.githubContributions}
                    color="blue"
                />
                <MetricCard
                    icon={<Award className="h-4 w-4" />}
                    label="Farcaster"
                    value={metrics.farcasterActivity}
                    color="purple"
                />
            </div>

            {/* Top Credentials */}
            {talentData.credentials.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Top Credentials
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {talentData.credentials.slice(0, 5).map((cred, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-secondary/20 hover:bg-secondary/30 transition-colors"
                            >
                                <span className="text-foreground/80 truncate flex-1">{cred.name}</span>
                                <span className="font-mono text-purple-400 ml-2">+{cred.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

interface MetricCardProps {
    icon: React.ReactNode
    label: string
    value: number
    color: "cyan" | "green" | "blue" | "purple"
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
    const colorClasses = {
        cyan: "text-cyan-400 bg-cyan-500/10",
        green: "text-green-400 bg-green-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10",
    }

    return (
        <div className="glass-card-soft p-3 border border-white/5 hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-2 mb-1 ${colorClasses[color]}`}>
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="text-lg font-bold text-foreground">{value}</div>
        </div>
    )
}
