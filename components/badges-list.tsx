"use client"

import { Award, Flame, Sun, Zap, Heart, Trophy } from "lucide-react"

interface Badge {
    icon: any
    title: string
    subtitle: string
    color: string
    bgColor: string
}

export function BadgesList() {
    const badges: Badge[] = [
        {
            icon: Sun,
            title: "GM Master",
            subtitle: "Daily greeter",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10"
        },
        {
            icon: Flame,
            title: "Engagement King",
            subtitle: "High interaction rate",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        },
        {
            icon: Heart,
            title: "Community Builder",
            subtitle: "Active supporter",
            color: "text-pink-500",
            bgColor: "bg-pink-500/10"
        },
        {
            icon: Zap,
            title: "Fast Responder",
            subtitle: "Quick to reply",
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10"
        },
        {
            icon: Trophy,
            title: "Top Contributor",
            subtitle: "Quality content creator",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        }
    ]

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground text-shadow-sm mb-4">Your TrueScore Badges</h3>

            {badges.map((badge, index) => {
                const Icon = badge.icon
                return (
                    <div
                        key={index}
                        className="glass-card-strong p-4 rounded-xl hover:scale-102 transition-all hover:border-primary/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${badge.bgColor}`}>
                                <Icon className={`w-6 h-6 ${badge.color}`} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground text-shadow-sm">{badge.title}</h4>
                                <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
                            </div>
                            <Award className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
