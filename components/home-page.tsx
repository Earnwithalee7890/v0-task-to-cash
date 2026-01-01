"use client"

import { useState, useEffect } from "react"
import { ScoreDisplay } from "./score-display"
import { ReputationBadge } from "./reputation-badge"
import { QuotientScoreCard } from "./quotient-score-card"
import { ProfileStatsRow } from "./profile-stats-row"
import { StatsGrid } from "./stats-grid"
import { DailyCheckin } from "./daily-checkin"
import { BadgesList } from "./badges-list"
import { ShareCard } from "./share-card"
import { Confetti } from "./confetti"
import { LevelProgress } from "./level-progress"
import { LuckySpin } from "./lucky-spin"

import { Plus, Share2, User } from "lucide-react"
import sdk from "@farcaster/frame-sdk"
import type { UserData } from "./truescore-app"

interface HomePageProps {
    userData: UserData
    onAddToMiniApp: () => void
    onShare: () => void
    onShareBase: () => void
    onShowYearReback: () => void
}

export function HomePage({ userData, onAddToMiniApp, onShare, onShareBase, onShowYearReback }: HomePageProps) {
    const [showConfetti, setShowConfetti] = useState(false)

    // Feature 8: Confetti for High Scores (Trigger logic)
    useEffect(() => {
        if (userData.score >= 80) {
            const hasSeenConfetti = sessionStorage.getItem(`confetti_seen_${userData.fid}`)
            if (!hasSeenConfetti) {
                setShowConfetti(true)
                sessionStorage.setItem(`confetti_seen_${userData.fid}`, "true")
            }
        }
    }, [userData.score, userData.fid])

    return (
        <div className="space-y-6 pb-2 relative">
            <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

            {/* DEBUG: Show FID being used (Click to Copy) */}
            <div className="opacity-0 animate-slide-up stagger-0 text-center">
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(userData.fid.toString())
                        // Could add a toast here, but for now simple visual feedback via active state is fine
                    }}
                    className="text-xs text-muted-foreground/60 hover:text-cyan-400 transition-colors cursor-pointer active:scale-95"
                    title="Click to copy FID"
                >
                    FID: {userData.fid} 📋
                </button>
            </div>

            {/* Neynar Score Display */}
            <div className="opacity-0 animate-slide-up stagger-1">
                <LevelProgress score={userData.score} />
                <div className="mt-4">
                    <ScoreDisplay score={userData.score} />
                </div>
            </div>




            {/* Reputation Badge */}
            <div className="flex justify-center opacity-0 animate-slide-up stagger-2">
                <ReputationBadge reputation={userData.reputation} />
            </div>

            {/* Daily Check-in */}
            <div className="opacity-0 animate-slide-up stagger-3 space-y-4">
                <LuckySpin />
                <DailyCheckin />
            </div>

            {/* Year Reback Banner */}
            <div className="opacity-0 animate-slide-up stagger-4">
                <button
                    onClick={onShowYearReback}
                    className="w-full py-5 px-5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-between group hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
                >
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-fuchsia-200">2025 Year Reback</span>
                        <span className="text-xs text-violet-300/60 group-hover:text-violet-200 transition-colors">Tap to replay your timeline ↺</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                        <Share2 className="h-4 w-4 text-violet-300" />
                    </div>
                </button>
            </div>

            {/* Share Card */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <ShareCard
                    score={userData.score}
                    reputation={userData.reputation}
                    onShareFarcaster={onShare}
                    onShareBase={onShareBase}
                />
            </div>

            {/* Action Buttons - Contained in Box */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <div className="glass-card-strong p-5 rounded-2xl space-y-4 neon-border">
                    {/* Add App Button */}
                    <button
                        onClick={onAddToMiniApp}
                        className="glass-neon-button glossy-overlay w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-semibold text-white"
                    >
                        <Plus className="h-5 w-5" />
                        Add App
                    </button>

                    {/* Follow Owner Button */}
                    <button
                        onClick={() => sdk.actions.openUrl("https://warpcast.com/aleekhoso")}
                        className="group relative w-full flex items-center justify-center gap-3 h-14 rounded-full neon-border bg-secondary/20 backdrop-blur-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-500/10" />
                        <User className="h-6 w-6 text-cyan-300 relative" />
                        <div className="relative flex flex-col items-start leading-tight">
                            <span className="text-sm text-cyan-200">Follow Developer</span>
                            <span className="text-[10px] text-cyan-300/60">@aleekhoso</span>
                        </div>
                        <div className="relative px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-[10px] font-bold text-black letter-space-wide">PRO</div>
                    </button>

                    {/* Feature 5: Twitter Share */}
                    <button
                        onClick={() => {
                            const text = `I just checked my Farcaster Reputation on TrueScore! 🎯\n\nMy Score: ${userData.score}\n\nCheck yours here: https://v0-task-to-cash-seven.vercel.app`
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
                        }}
                        className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 transition-colors"
                    >
                        <span className="text-sm font-medium text-white/80">Share on X</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
