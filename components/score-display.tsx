"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const percentage = Math.min(score, 100)
  const circumference = 2 * Math.PI * 80
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    setMounted(true)
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary"
    if (score >= 60) return "text-chart-3"
    if (score >= 40) return "text-chart-2"
    return "text-destructive"
  }

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#4ade80"
    if (score >= 60) return "#facc15"
    if (score >= 40) return "#38bdf8"
    return "#f87171"
  }

  const getGlowColor = (score: number) => {
    if (score >= 80) return "rgba(74, 222, 128, 0.4)"
    if (score >= 60) return "rgba(250, 204, 21, 0.4)"
    if (score >= 40) return "rgba(56, 189, 248, 0.4)"
    return "rgba(248, 113, 113, 0.4)"
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-52 w-52 animate-float">
        <div
          className="absolute inset-4 rounded-full blur-2xl transition-all duration-1000"
          style={{ backgroundColor: getGlowColor(score), opacity: mounted ? 0.5 : 0 }}
        />

        <svg className="h-full w-full -rotate-90 relative" viewBox="0 0 180 180">
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getStrokeColor(score)} stopOpacity="1" />
              <stop offset="100%" stopColor={getStrokeColor(score)} stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="90" cy="90" r="80" fill="none" strokeWidth="10" className="stroke-secondary/50" />
          {/* Progress circle with glow */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="url(#progressGradient)"
            filter="url(#glow)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-6xl font-bold tabular-nums ${getScoreColor(score)} transition-all duration-300`}
            style={{
              textShadow: `0 0 30px ${getGlowColor(score)}`,
            }}
          >
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground mt-1">Neynar Score</span>
        </div>
      </div>
    </div>
  )
}
