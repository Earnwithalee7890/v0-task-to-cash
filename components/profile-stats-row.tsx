"use client"

import { Users, UserPlus, MessageCircle, Reply } from "lucide-react"

interface ProfileStatsRowProps {
    followers: number
    following: number
    casts?: number
    replies?: number
}

export function ProfileStatsRow({ followers, following, casts = 0, replies = 0 }: ProfileStatsRowProps) {
    const stats = [
        { label: "Followers", value: followers, icon: Users, color: "text-purple-500" },
        { label: "Following", value: following, icon: UserPlus, color: "text-cyan-500" },
        { label: "Casts", value: casts, icon: MessageCircle, color: "text-pink-500" },
        { label: "Replies", value: replies, icon: Reply, color: "text-blue-500" },
    ]

    return (
        <div className="grid grid-cols-4 gap-2">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div
                        key={stat.label}
                        className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 backdrop-blur-sm border border-border/30 hover:bg-secondary/50 transition-all hover:scale-105"
                    >
                        <Icon className={`w-5 h-5 mb-1 ${stat.color}`} />
                        <span className="text-lg font-bold text-foreground">{stat.value.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                    </div>
                )
            })}
        </div>
    )
}
