"use client"
import { useState, useEffect } from "react"

import { ScoreDisplay } from "./score-display"
import { ReputationBadge } from "./reputation-badge"
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
        <div className="space-y-8 pb-24">
            {/* Score Display */}
            <div className="opacity-0 animate-slide-up stagger-2">
                <ScoreDisplay score={userData.score} />
            </div>

            {/* Reputation Badge */}
            <div className="flex justify-center opacity-0 animate-slide-up stagger-3">
                <ReputationBadge reputation={userData.reputation} />
            </div>



            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 opacity-0 animate-slide-up stagger-4">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onAddToMiniApp}
                        className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                            <Plus className="h-4 w-4 text-white" />
                        </div>
                        Add App
                    </button>
                    <button
                        onClick={onShare}
                        className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                            <Share2 className="h-4 w-4 text-white" />
                        </div>
                        Share
                    </button>
                </div>

                <button
                    onClick={() => sdk.actions.openUrl("https://warpcast.com/aleekhoso")}
                    className="group relative flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-primary font-bold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute -right-4 -top-4 h-12 w-12 bg-primary/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                        <User className="relative h-9 w-9 rounded-full p-1 border-2 border-primary/50 text-primary" />
                    </div>
                    <div className="relative flex flex-col items-start leading-none">
                        <span className="text-sm">Follow Owner</span>
                        <span className="text-[10px] text-muted-foreground opacity-80">@aleekhoso</span>
                    </div>
                    <div className="relative ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">PRO</div>
                </button>
            </div>
        </div>
    )
}
