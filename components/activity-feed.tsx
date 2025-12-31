"use client"

import React from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActivityItem {
    type: "check-in" | "achievement" | "streak"
    title: string
    description: string
    timestamp: string
    txHash?: string
}

interface ActivityFeedProps {
    activities?: ActivityItem[]
}

/**
 * Component to display recent user activity (check-ins, streaks, achievements).
 */
export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
    const defaultActivities: ActivityItem[] = [
        {
            type: "check-in",
            title: "Daily Check-In",
            description: "Checked in on Base",
            timestamp: "2 hours ago",
        },
        {
            type: "streak",
            title: "3-Day Streak!",
            description: "You're on fire! 🔥",
            timestamp: "2 hours ago",
        },
    ]

    const displayActivities = activities.length > 0 ? activities : defaultActivities

    const getActivityIcon = (type: ActivityItem["type"]) => {
        switch (type) {
            case "check-in":
                return "✅"
            case "achievement":
                return "🏆"
            case "streak":
                return "🔥"
        }
    }

    const getActivityColor = (type: ActivityItem["type"]) => {
        switch (type) {
            case "check-in":
                return "border-cyan-400/30 bg-cyan-500/10"
            case "achievement":
                return "border-purple-400/30 bg-purple-500/10"
            case "streak":
                return "border-orange-400/30 bg-orange-500/10"
        }
    }

    return (
        <div className="glass-card-strong p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">Recent Activity</h3>
                <span className="text-xs text-muted-foreground">Last 24h</span>
            </div>

            <div className="space-y-2">
                {displayActivities.map((activity, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-xl border-2 ${getActivityColor(activity.type)} transition-all hover:scale-[1.02]`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{activity.timestamp}</p>
                            </div>
                            {activity.txHash && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => window.open(`https://basescan.org/tx/${activity.txHash}`, '_blank')}
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {displayActivities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs mt-1">Check in to see your activity here!</p>
                </div>
            )}
        </div>
    )
}

export const ActivityFeedMemo = React.memo(ActivityFeed)
