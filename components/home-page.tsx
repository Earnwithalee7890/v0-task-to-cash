"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
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
import { BaseGasTracker } from "./base-gas-tracker"
import { ScoreHistory } from "./score-history"
import { ActionCard } from "./action-card"

import { Plus, Share2, User, RefreshCw } from "lucide-react"
import sdk from "@farcaster/frame-sdk"
import type { UserData } from "./truescore-app"

interface HomePageProps {
    userData: UserData
    onAddToMiniApp: () => void
    onShare: () => void
    onShareBase: () => void
    onShareLinkedIn?: () => void
    onShowYearReback: () => void
    onRefresh: () => void
}

export function HomePage({ userData, onAddToMiniApp, onShare, onShareBase, onShareLinkedIn, onShowYearReback, onRefresh }: HomePageProps) {
    const [showConfetti, setShowConfetti] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

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

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await onRefresh()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    return (
        <div className="space-y-6 pb-2 relative">
            <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

            {/* DEBUG: Show FID being used (Click to Copy) */}
            <div className="opacity-0 animate-slide-up stagger-0 text-center flex flex-col justify-center items-center gap-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(userData.fid.toString())
                            toast.success("FID Copied to clipboard!")
                        }}
                        className="text-xs text-muted-foreground/60 hover:text-cyan-400 transition-colors cursor-pointer active:scale-95"
                        title="Click to copy FID"
                    >
                        FID: {userData.fid} 📋
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="text-xs text-muted-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-1 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>

                    {/* Feature 4: Manual Confetti Trigger */}
                    {userData.score >= 80 && (
                        <button
                            onClick={() => setShowConfetti(true)}
                            className="text-xs text-muted-foreground/60 hover:text-pink-400 transition-colors flex items-center gap-1 active:scale-95"
                        >
                            🎉 Celebrate
                        </button>
                    )}
                </div>

                {/* Feature 11: Base Gas Tracker */}
                <BaseGasTracker />
            </div>

            {/* Neynar Score Display */}
            <div className="opacity-0 animate-slide-up stagger-1">
                <LevelProgress score={userData.score} />
                <div className="mt-4">
                    <ScoreDisplay score={userData.score} />
                </div>
                {/* Feature 2: 7 Day Trend */}
                <div className="mt-4">
                    <ScoreHistory currentScore={userData.score} />
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
                <ActionCard
                    userData={userData}
                    onAddToMiniApp={onAddToMiniApp}
                    onShareLinkedIn={onShareLinkedIn}
                />
            </div>
        </div>
    )
}
