"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Share2 } from "lucide-react"

interface QuotientScoreCardProps {
    fid: number
}

interface QuotientData {
    quotientScore: number
    quotientScoreRaw: number
    rank: number
}

export function QuotientScoreCard({ fid }: QuotientScoreCardProps) {
    const [data, setData] = useState<QuotientData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchQuotientScore = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/quotient?fid=${fid}`)

            if (!response.ok) {
                throw new Error("Failed to fetch Quotient score")
            }

            const quotientData = await response.json()
            setData(quotientData)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (fid) {
            fetchQuotientScore()
        }
    }, [fid])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchQuotientScore()
    }

    const handleShare = () => {
        if (!data) return
        const text = `My Quotient Score: ${data.quotientScore} 🎯\nGlobal Rank: #${data.rank}\n\nCheck yours!`
        if (navigator.share) {
            navigator.share({ text })
        }
    }

    if (loading && !refreshing) {
        return (
            <div className="glass-card-strong p-6 rounded-2xl">
                <div className="flex flex-col items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
                    <p className="text-sm text-muted-foreground">Loading Quotient Score...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-card-strong p-6 rounded-2xl border-red-500/20">
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-red-500 font-semibold mb-1">Error Fetching Score</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="glass-card-strong p-6 rounded-2xl">
                <p className="text-center text-muted-foreground">Invalid FID</p>
            </div>
        )
    }

    const percentage = Math.min((data.quotientScore / 100) * 100, 100)
    const circumference = 2 * Math.PI * 70

    return (
        <div className="glass-card-strong p-6 rounded-2xl space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-foreground text-shadow-sm">Quotient Reputation</h3>
                <p className="text-xs text-muted-foreground">Farcaster reputation score</p>
            </div>

            {/* Circular Score Indicator */}
            <div className="relative flex items-center justify-center">
                <div className="relative w-48 h-48">
                    {/* Glow effect */}
                    <div className="absolute inset-4 rounded-full bg-purple-500/30 blur-2xl" />

                    {/* SVG Circle */}
                    <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="quotientGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="50%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                            <filter id="quotientGlow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-secondary/30"
                        />

                        {/* Progress circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="url(#quotientGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            filter="url(#quotientGlow)"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: circumference - (percentage / 100) * circumference,
                                transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        />
                    </svg>

                    {/* Score text in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                            {data.quotientScore}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Quotient Score</span>
                    </div>
                </div>
            </div>

            {/* Rank Display */}
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                <p className="text-sm text-muted-foreground">Global Rank</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    #{data.rank.toLocaleString()}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    <span className="font-semibold text-sm">Refresh</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-gradient-purple text-white font-semibold hover:scale-105 active:scale-95 transition-all"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {/* Raw Score (small detail) */}
            <div className="text-center pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                    Raw Score: <span className="font-mono font-semibold">{data.quotientScoreRaw.toFixed(2)}</span>
                </p>
            </div>
        </div>
    )
}
