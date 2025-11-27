"use client"

import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Shield, ShieldAlert, ShieldX } from "lucide-react"

interface ReputationBadgeProps {
  reputation: "safe" | "neutral" | "risky" | "spammy"
}

export function ReputationBadge({ reputation }: ReputationBadgeProps) {
  const config = {
    safe: {
      label: "Safe Account",
      icon: ShieldCheck,
      className: "bg-primary/15 text-primary border-primary/30 shadow-primary/20",
      glow: "shadow-[0_0_20px_rgba(74,222,128,0.3)]",
    },
    neutral: {
      label: "Neutral Account",
      icon: Shield,
      className: "bg-chart-2/15 text-chart-2 border-chart-2/30 shadow-chart-2/20",
      glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
    },
    risky: {
      label: "Risky Account",
      icon: ShieldAlert,
      className: "bg-chart-3/15 text-chart-3 border-chart-3/30 shadow-chart-3/20",
      glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]",
    },
    spammy: {
      label: "Spammy Account",
      icon: ShieldX,
      className: "bg-destructive/15 text-destructive border-destructive/30 shadow-destructive/20",
      glow: "shadow-[0_0_20px_rgba(248,113,113,0.3)]",
    },
  }

  const { label, icon: Icon, className, glow } = config[reputation]

  return (
    <Badge
      variant="outline"
      className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 ${className} ${glow}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Badge>
  )
}
