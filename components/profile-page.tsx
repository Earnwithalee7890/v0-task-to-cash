"use client"

import { useState } from "react"
import { UserStats } from "./user-stats"
import { DailyCheckin } from "./daily-checkin"
import { CreatorTip } from "./creator-tip"
import { ScoreHistory } from "./score-history"
import { RivalComparisonModal } from "./rival-comparison-modal"
import { BioGenerator } from "./bio-generator"
import { PowerCard } from "./power-card"
import { Swords } from "lucide-react"
import type { UserData } from "./truescore-app"

interface ProfilePageProps {
    userData: UserData
}

export function ProfilePage({ userData }: ProfilePageProps) {
    const [showRivalModal, setShowRivalModal] = useState(false)

    return (
        <div className="space-y-6 pb-24">
            {/* User Info */}
            <div className="flex items-center justify-center gap-4 opacity-0 animate-slide-up stagger-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
                    <img
                        src={userData.pfpUrl || "/placeholder.svg"}
                        alt={userData.displayName}
                        className="relative h-20 w-20 rounded-full border-2 border-primary/50 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-transform hover:scale-105"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-xl text-foreground">{userData.displayName}</p>
                    <p className="text-sm text-muted-foreground mb-2">@{userData.username}</p>
                    {userData.bio && (
                        <p className="text-xs text-center text-muted-foreground/80 max-w-[250px] leading-relaxed line-clamp-3 mb-3">
                            {userData.bio}
                        </p>
                    )}
                    <button
                        onClick={() => setShowRivalModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                    >
                        <Swords className="h-3 w-3" />
                        Battle a Friend
                    </button>
                </div>
            </div>

            <RivalComparisonModal
                isOpen={showRivalModal}
                onClose={() => setShowRivalModal(false)}
                currentUser={userData}
            />

            {/* Followers/Following Stats */}
            <div className="opacity-0 animate-slide-up stagger-2">
                <UserStats followers={userData.followers} following={userData.following} />
            </div>

            {/* Daily Check-in */}
            <div className="opacity-0 animate-slide-up stagger-3">
                <DailyCheckin />
            </div>

            {/* Tip the Creator */}
            <div className="opacity-0 animate-slide-up stagger-4">
                <CreatorTip />
            </div>

            {/* Feature 6: Score History */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <ScoreHistory currentScore={userData.score} />
            </div>

            {/* Feature 5: Bio Generator */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <BioGenerator score={userData.score} rank={userData.score * 10} followers={userData.followers} />
            </div>

            {/* Feature 8: Power Card */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <PowerCard userData={userData} />
            </div>
        </div>
    )
}
