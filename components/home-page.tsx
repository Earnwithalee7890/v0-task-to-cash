"use client"

import { useState } from "react"
import { ScoreDisplay } from "./score-display"
import { ReputationBadge } from "./reputation-badge"
import { QuotientScoreCard } from "./quotient-score-card"
import { ProfileStatsRow } from "./profile-stats-row"
import { StatsGrid } from "./stats-grid"
import { AIAnalysisSection } from "./ai-analysis-section"
import { BadgesList } from "./badges-list"
import { ShareCard } from "./share-card"
import { AIInsightsModal } from "./ai-insights-modal"
import { AIPostMaker } from "./ai-post-maker"
import { TalentScoreCard } from "./talent-score-card"
import { Plus, Share2, User } from "lucide-react"
import sdk from "@farcaster/frame-sdk"
import type { UserData } from "./truescore-app"

interface HomePageProps {
    userData: UserData
    onAddToMiniApp: () => void
    onShare: () => void
}

export function HomePage({ userData, onAddToMiniApp, onShare }: HomePageProps) {
    console.log('[DEBUG] HomePage UserData:', {
        builderScore: userData.builderScore,
        creatorScore: userData.creatorScore,
        handle: userData.talentHandle
    })
    const [showAIInsights, setShowAIInsights] = useState(false)

    const handleAIInsights = () => {
        setShowAIInsights(true)
    }

    return (
        <>
            {/* AI Insights Modal */}
            {showAIInsights && (
                <AIInsightsModal
                    userData={userData}
                    onClose={() => setShowAIInsights(false)}
                />
            )}

            <div className="space-y-6 pb-2">
                {/* DEBUG: Show FID being used */}
                <div className="opacity-0 animate-slide-up stagger-0 text-center">
                    <p className="text-xs text-muted-foreground">FID: {userData.fid}</p>
                </div>

                {/* Neynar Score Display */}
                <div className="opacity-0 animate-slide-up stagger-1">
                    <ScoreDisplay score={userData.score} />
                </div>

                {/* Verified Reputation (Talent Protocol) */}
                {(userData.builderScore !== undefined || userData.creatorScore !== undefined) && (
                    <div className="w-full">
                        <TalentScoreCard
                            builderScore={userData.builderScore}
                            creatorScore={userData.creatorScore}
                            farcasterRevenue={userData.farcasterRevenue}
                            isHuman={userData.isHuman}
                            isVerified={userData.isVerified}
                            handle={userData.talentHandle}
                        />
                    </div>
                )}


                {/* Reputation Badge */}
                <div className="flex justify-center opacity-0 animate-slide-up stagger-2">
                    <ReputationBadge reputation={userData.reputation} />
                </div>



                {/* AI Post Maker */}
                <div className="opacity-0 animate-slide-up stagger-3">
                    <AIPostMaker />
                </div>




                {/* AI Analysis Section */}
                <div className="opacity-0 animate-slide-up stagger-4">
                    <AIAnalysisSection onGetInsights={handleAIInsights} />
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
        </>
    )
}
