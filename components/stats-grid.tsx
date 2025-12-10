"use client"

import { MessageSquare, Clock, Handshake, Medal } from "lucide-react"

interface StatsGridProps {
    replyRate?: number
    dailyActivity?: string
    mentionsGiven?: number
    communityRank?: string
}

export function StatsGrid({
    replyRate = 68,
    dailyActivity = "21h",
    mentionsGiven = 439,
    communityRank = "Top 19%"
}: StatsGridProps) {
    const stats = [
        {
            icon: MessageSquare,
            label: "Reply Rate",
            value: `${replyRate}%`,
            color: "from-purple-500 to-pink-500",
            iconColor: "text-purple-500"
        },
        {
            icon: Clock,
            label: "Daily Activity",
            value: dailyActivity,
            color: "from-cyan-500 to-blue-500",
            iconColor: "text-cyan-500"
        },
        {
            icon: Handshake,
            label: "Mentions Given",
            value: mentionsGiven.toLocaleString(),
            color: "from-pink-500 to-rose-500",
            iconColor: "text-pink-500"
        },
        {
            icon: Medal,
            label: "Community Rank",
            value: communityRank,
            color: "from-amber-500 to-orange-500",
            iconColor: "text-amber-500"
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div
                        key={stat.label}
                        className="glass-card-strong p-4 rounded-xl hover:scale-105 transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-foreground text-shadow-sm">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
