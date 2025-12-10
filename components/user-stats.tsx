"use client"

import { Card } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"

interface UserStatsProps {
  followers: number
  following: number
}

export function UserStats({ followers, following }: UserStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const stats = [
    { label: "Followers", value: followers, icon: Users, color: "from-cyan-400 to-blue-500", glow: "box-glow-aqua" },
    { label: "Following", value: following, icon: UserPlus, color: "from-pink-400 to-rose-500", glow: "box-glow-cyan" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className={`glass-card-strong group p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-110 cursor-default border-2 ${stat.glow}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} transition-transform group-hover:scale-110 shadow-lg`}
          >
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{formatNumber(stat.value)}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}
