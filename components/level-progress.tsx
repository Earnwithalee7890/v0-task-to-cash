"use client"

import { Trophy, ChevronRight } from "lucide-react"

interface LevelProgressProps {
    score: number
}

export function LevelProgress({ score }: LevelProgressProps) {
    // Basic gamification logic
    // Level = floor(score / 100) + 1
    // XP for current level = score % 100
    // XP needed for next level = 100 (linear scaling for simplicity)

    // More complex: 
    // Levels: 0-50 (Newbie), 51-80 (Scout), 81-90 (Influencer), 91-100 (Legend)
    // But since scores are 0-100 usually (Nejnar score?), let's base it on that.
    // If score is > 100, we treat it differently. Neynar score is usually 0-100% or similar?
    // Let's assume Neynar score is 0-100.

    // Ranks:
    // 0-20: Novice
    // 21-50: Apprentice
    // 51-75: Adept
    // 76-90: Master
    // 91-100: Grandmaster

    let rankTitle = "Novice"
    let nextTitle = "Apprentice"
    let minScore = 0
    let maxScore = 20
    let color = "text-gray-400"
    let barColor = "bg-gray-500"

    if (score > 20 && score <= 50) {
        rankTitle = "Apprentice"
        nextTitle = "Adept"
        minScore = 20
        maxScore = 50
        color = "text-blue-400"
        barColor = "bg-blue-500"
    } else if (score > 50 && score <= 75) {
        rankTitle = "Adept"
        nextTitle = "Master"
        minScore = 50
        maxScore = 75
        color = "text-purple-400"
        barColor = "bg-purple-500"
    } else if (score > 75 && score <= 90) {
        rankTitle = "Master"
        nextTitle = "Grandmaster"
        minScore = 75
        maxScore = 90
        color = "text-orange-400"
        barColor = "bg-orange-500"
    } else if (score > 90) {
        rankTitle = "Grandmaster"
        nextTitle = "Legend"
        minScore = 90
        maxScore = 100
        color = "text-yellow-400"
        barColor = "bg-yellow-500"
    }

    const progress = Math.min(100, Math.max(0, ((score - minScore) / (maxScore - minScore)) * 100))

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${barColor} opacity-5 blur-[60px] rounded-full`} />

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 pt-1">
                    <Trophy className={`h-4 w-4 ${color}`} />
                    <span className={`font-bold ${color}`}>{rankTitle}</span>
                </div>
            </div>

            <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} transition-all duration-1000 ease-out relative`}
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse" />
                </div>
            </div>

            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground/60 font-mono">
                <span>{minScore} XP</span>
                <span>{score.toFixed(1)} / {maxScore} XP</span>
            </div>
        </div>
    )
}
