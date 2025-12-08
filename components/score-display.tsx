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
  \u003cdiv className = "flex flex-col items-center justify-center"\u003e
  {/* Premium Glass Container */ }
  \u003cdiv className = "relative"\u003e
  {/* Multi-layered glow backdrop */ }
  \u003cdiv className = "absolute -inset-8 opacity-0 animate-fade-in"\u003e
  \u003cdiv
  className = "absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
  style = {{ backgroundColor: getGlowColor(score), opacity: mounted ? 0.6 : 0 }
}
          /\u003e
\u003cdiv
className = "absolute inset-4 rounded-full blur-2xl transition-all duration-1000"
style = {{ backgroundColor: getGlowColor(score), opacity: mounted ? 0.4 : 0 }}
          /\u003e
\u003c / div\u003e

{/* Glassmorphic background card - NO BORDERS */ }
\u003cdiv className = "relative backdrop-blur-xl bg-gradient-to-br from-background/60 via-background/40 to-background/60 rounded-3xl p-8 shadow-2xl"\u003e
{/* Inner glow ring */ }
\u003cdiv
className = "absolute inset-0 rounded-3xl opacity-50"
style = {{
  background: `radial-gradient(circle at center, transparent 40%, ${getGlowColor(score)} 100%)`,
            }}
          /\u003e

\u003cdiv className = "relative h-52 w-52 animate-float"\u003e
\u003csvg className = "h-full w-full -rotate-90 relative" viewBox = "0 0 180 180"\u003e
\u003cdefs\u003e
{/* Enhanced gradient with multiple stops */ }
\u003clinearGradient id = "progressGradient" x1 = "0%" y1 = "0%" x2 = "100%" y2 = "100%"\u003e
\u003cstop offset = "0%" stopColor = { getStrokeColor(score) } stopOpacity = "1" /\u003e
\u003cstop offset = "50%" stopColor = { getStrokeColor(score) } stopOpacity = "0.9" /\u003e
\u003cstop offset = "100%" stopColor = { getStrokeColor(score) } stopOpacity = "0.7" /\u003e
\u003c / linearGradient\u003e
{/* Stronger glow filter */ }
\u003cfilter id = "glow"\u003e
\u003cfeGaussianBlur stdDeviation = "4" result = "coloredBlur" /\u003e
\u003cfeMerge\u003e
\u003cfeMergeNode in="coloredBlur" /\u003e
\u003cfeMergeNode in="coloredBlur" /\u003e
\u003cfeMergeNode in="SourceGraphic" /\u003e
\u003c / feMerge\u003e
\u003c / filter\u003e
\u003c / defs\u003e

{/* Background track - very subtle, no visible border */ }
\u003ccircle
cx = "90"
cy = "90"
r = "80"
fill = "none"
strokeWidth = "8"
className = "stroke-secondary/20"
  /\u003e

{/* Progress circle with enhanced glow - NO BORDER */ }
\u003ccircle
cx = "90"
cy = "90"
r = "80"
fill = "none"
strokeWidth = "12"
strokeLinecap = "round"
stroke = "url(#progressGradient)"
filter = "url(#glow)"
style = {{
  strokeDasharray: circumference,
    strokeDashoffset,
    transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              /\u003e
\u003c / svg\u003e

{/* Score text with enhanced styling */ }
\u003cdiv className = "absolute inset-0 flex flex-col items-center justify-center"\u003e
\u003cspan
className = {`text-7xl font-black tabular-nums ${getScoreColor(score)} transition-all duration-300`}
style = {{
  textShadow: `0 0 40px ${getGlowColor(score)}, 0 0 20px ${getGlowColor(score)}`,
                }}
\u003e
{ animatedScore }
\u003c / span\u003e
\u003cspan className = "text-xs font-semibold text-muted-foreground/80 mt-2 tracking-wider uppercase"\u003eNeynar Score\u003c / span\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
  )
}
