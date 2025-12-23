"use client"

import { useState } from "react"
import { ScoreDisplay } from "./score-display"
import { ReputationBadge } from "./reputation-badge"
import { QuotientScoreCard } from "./quotient-score-card"
import { ProfileStatsRow } from "./profile-stats-row"
import { StatsGrid } from "./stats-grid"
import { DailyCheckin } from "./daily-checkin"
import { BadgesList } from "./badges-list"
import { ShareCard } from "./share-card"

import { Plus, Share2, User } from "lucide-react"
import sdk from "@farcaster/frame-sdk"
import type { UserData } from "./truescore-app"

interface HomePageProps {
    userData: UserData
    onAddToMiniApp: () => void
    onShare: () => void
}

export function HomePage({ userData, onAddToMiniApp, onShare }: HomePageProps) {

    return (
        <div className="space-y-6 pb-2">
            {/* DEBUG: Show FID being used */}
            <div className="opacity-0 animate-slide-up stagger-0 text-center">
                <p className="text-xs text-muted-foreground">FID: {userData.fid}</p>
            </div>

            {/* Neynar Score Display */}
            <div className="opacity-0 animate-slide-up stagger-1">
                <ScoreDisplay score={userData.score} />
            </div>




            {/* Reputation Badge */}
            <div className="flex justify-center opacity-0 animate-slide-up stagger-2">
                <ReputationBadge reputation={userData.reputation} />
            </div>

            {/* Daily Check-in */}
            <div className="opacity-0 animate-slide-up stagger-3">
                <DailyCheckin />
            </div>


            {/* Share Card */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <ShareCard
                    score={userData.score}
                    reputation={userData.reputation}
                    onShareFarcaster={onShare}
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
                </div>
            </div>
        </div>
    )
}
