"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const percentage = Math.min(score, 100)
  const circumference = 2 * Math.PI * 70
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-64 w-64">
        {/* Outer neon glow rings */}
        <div
          className="absolute inset-0 rounded-full box-glow-aqua animate-pulse-neon"
          style={{ opacity: mounted ? 0.4 : 0 }}
        />
        <div
          className="absolute inset-4 rounded-full box-glow-cyan"
          style={{ opacity: mounted ? 0.3 : 0 }}
        />

        {/* SVG Circle */}
        <svg className="h-full w-full -rotate-90 relative" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="neonScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" />
              <stop offset="50%" stopColor="#00ffcc" />
              <stop offset="100%" stopColor="#0088ff" />
            </linearGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            strokeWidth="6"
            stroke="rgba(0, 217, 255, 0.15)"
          />

          {/* Progress circle with neon glow */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="url(#neonScoreGradient)"
            filter="url(#neonGlow)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Score number with aqua neon glow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center">
            <span
              className="text-7xl font-bold tabular-nums neon-glow-aqua animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              {animatedScore}
            </span>
            {/* Elite Badge */}
            {score >= 90 && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-600 text-[10px] font-black text-black px-2 py-0.5 rounded-full shadow-lg border border-yellow-200 animate-pulse">
                ELITE
              </div>
            )}
          </div>
          <span className="text-sm text-cyan-300/80 mt-2 letter-space-wide">NEYNAR SCORE</span>
        </div>
      </div>
    </div>
  )
}
