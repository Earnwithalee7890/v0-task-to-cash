"use client"

import { Badge, CheckCircle, Star, Zap, Flame, Trophy, Target } from "lucide-react"

interface Achievement {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    unlocked: boolean
    progress?: number
    total?: number
}

interface AchievementBadgesProps {
    totalCheckIns: number
    currentStreak: number
    neynarScore: number
}

export function AchievementBadges({ totalCheckIns, currentStreak, neynarScore }: AchievementBadgesProps) {
    const achievements: Achievement[] = [
        {
            id: "first-checkin",
            title: "First Steps",
            description: "Complete your first check-in",
            icon: <CheckCircle className="h-4 w-4" />,
            unlocked: totalCheckIns >= 1,
        },
        {
            id: "week-warrior",
            title: "Week Warrior",
            description: "Maintain a 7-day streak",
            icon: <Flame className="h-4 w-4" />,
            unlocked: currentStreak >= 7,
            progress: Math.min(currentStreak, 7),
            total: 7,
        },
        {
            id: "dedicated",
            title: "Dedicated",
            description: "Check in 10 times",
            icon: <Zap className="h-4 w-4" />,
            unlocked: totalCheckIns >= 10,
            progress: Math.min(totalCheckIns, 10),
            total: 10,
        },
        {
            id: "month-master",
            title: "Month Master",
            description: "30-day streak",
            icon: <Trophy className="h-4 w-4" />,
            unlocked: currentStreak >= 30,
            progress: Math.min(currentStreak, 30),
            total: 30,
        },
        {
            id: "high-reputation",
            title: "Trusted",
            description: "Reach 80+ Neynar score",
            icon: <Star className="h-4 w-4" />,
            unlocked: neynarScore >= 80,
            progress: Math.min(neynarScore, 80),
            total: 80,
        },
        {
            id: "veteran",
            title: "Veteran",
            description: "50 total check-ins",
            icon: <Target className="h-4 w-4" />,
            unlocked: totalCheckIns >= 50,
            progress: Math.min(totalCheckIns, 50),
            total: 50,
        },
    ]

    const unlockedCount = achievements.filter(a => a.unlocked).length

    return (
        <div className="glass-card-strong p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Badge className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Achievements</h3>
                        <p className="text-xs text-muted-foreground">
                            {unlockedCount} of {achievements.length} unlocked
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`
              relative p-3 rounded-xl border-2 transition-all duration-300
              ${achievement.unlocked
                                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/40 shadow-lg'
                                : 'bg-secondary/20 border-border/30 opacity-60'
                            }
            `}
                        title={achievement.description}
                    >
                        <div className={`
              flex flex-col items-center gap-1
              ${achievement.unlocked ? 'text-purple-300' : 'text-muted-foreground'}
            `}>
                            <div className={`
                p-2 rounded-lg
                ${achievement.unlocked
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                                    : 'bg-secondary'
                                }
              `}>
                                {achievement.icon}
                            </div>
                            <p className="text-[10px] font-semibold text-center leading-tight">
                                {achievement.title}
                            </p>

                            {!achievement.unlocked && achievement.progress !== undefined && achievement.total && (
                                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mt-1">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
