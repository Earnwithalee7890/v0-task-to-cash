"use client"

import { useState, useEffect, useCallback } from "react"
import { ScoreDisplay } from "./score-display"
import { UserStats } from "./user-stats"
import { ReputationBadge } from "./reputation-badge"
import { DailyCheckin } from "./daily-checkin"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { ClickSpark } from "./click-spark"
import { CreatorTip } from "./creator-tip"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Share2, User } from "lucide-react"
import sdk, { type FrameContext } from "@farcaster/frame-sdk"

export interface UserData {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  score: number
  reputation: "safe" | "neutral" | "risky" | "spammy"
  followers: number
  following: number
  verifiedAddresses: string[]
  quotient: number
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [showScoreUpdate, setShowScoreUpdate] = useState(false)

  const updateUserData = (data: any) => {
    const newQuotient = data.score ? Number((data.score / 100).toFixed(2)) : 0.0
    const lastQuotient = Number(localStorage.getItem("lastQuotient") ?? "-1")
    if (lastQuotient !== -1 && lastQuotient !== newQuotient) {
      const lastNotified = Number(localStorage.getItem("lastNotified") ?? "0")
      const now = Date.now()
      if (now - lastNotified > 7 * 24 * 60 * 60 * 1000) {
        setShowScoreUpdate(true)
        localStorage.setItem("lastNotified", now.toString())
      }
    }
    localStorage.setItem("lastQuotient", newQuotient.toString())
    setUserData({ ...data, quotient: newQuotient })
  }

  const fetchUserData = useCallback(async (fid: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/neynar/user?fid=${fid}`)
      if (!response.ok) throw new Error("Failed to fetch user data")
      const data = await response.json()
      updateUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      return newTheme
    })
  }, [])

  const addToMiniApp = useCallback(() => {
    sdk.actions.addFrame()
    setShowAddPrompt(false)
  }, [])

  const shareApp = useCallback(() => {
    const text = `Check out my TrueScore! My Neynar reputation is ${userData?.score}.`
    const url = "https://v0-task-to-cash-seven.vercel.app"
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`)
  }, [userData])

  useEffect(() => {
    const init = async () => {
      try {
        const frameContext = await sdk.context
        setContext(frameContext)
        if ((frameContext?.client as any)?.theme) {
          const fcTheme = (frameContext.client as any).theme === "dark" ? "dark" : "light"
          setTheme(fcTheme)
          document.documentElement.classList.toggle("dark", fcTheme === "dark")
        }
        if (!frameContext?.user?.fid) {
          setShowAddPrompt(true)
        }
        const fid = frameContext?.user?.fid ?? 338060
        await fetchUserData(fid)
        await sdk.actions.ready()
        setIsSDKLoaded(true)
      } catch (e) {
        console.error("SDK init error", e)
        setIsSDKLoaded(true)
        await fetchUserData(338060)
      }
    }
    init()
  }, [fetchUserData])

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-5/5 pointer-events-none" />
        <div className="relative mx-auto max-w-md space-y-6">
          <div className="text-center animate-pulse">
            <h1 className="text-3xl font-bold text-foreground">TrustScore</h1>
            <p className="text-sm text-muted-foreground">Loading your score...</p>
          </div>
          <Skeleton className="mx-auto h-52 w-52 rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-destructive/5 via-background to-chart-5/5 pointer-events-none" />
        <div className="relative text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">TrustScore</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </main>
    )
  }

  if (!userData) return null

  return (
    <main className="min-h-screen bg-background px-4 py-8 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/8 via-background to-chart-5/8 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-30" />

      {showAddPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-background rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Add TrueScore Mini App</h2>
            <p className="text-muted-foreground mb-4">Add this mini app to your Farcaster feed for quick access.</p>
            <button
              onClick={addToMiniApp}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition"
            >
              Add Mini App
            </button>
          </div>
        </div>
      )}

      {showScoreUpdate && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-primary/10 border border-primary/30 text-foreground px-4 py-2 rounded-md shadow-md animate-fade-in z-40">
          <p>Your Neynar score has been updated this week! Check the new score.</p>
        </div>
      )}

      <div className="relative mx-auto max-w-md space-y-8">
        <header className="opacity-0 animate-fade-in">
          <ClickSpark />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10" />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <p className="text-sm text-muted-foreground text-center">Your real Neynar reputation</p>
        </header>

        <div className="flex items-center justify-center gap-4 opacity-0 animate-slide-up stagger-1">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
            <img
              src={userData.pfpUrl || "/placeholder.svg"}
              alt={userData.displayName}
              className="relative h-14 w-14 rounded-full border-2 border-primary/50 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-transform hover:scale-105"
            />
          </div>
          <div>
            <p className="font-semibold text-lg text-foreground">{userData.displayName}</p>
            <p className="text-sm text-muted-foreground">@{userData.username}</p>
          </div>
        </div>

        <div className="opacity-0 animate-slide-up stagger-2">
          <ScoreDisplay score={userData.score} />
        </div>

        <div className="flex justify-center opacity-0 animate-slide-up stagger-3">
          <ReputationBadge reputation={userData.reputation} />
        </div>

        <div className="opacity-0 animate-slide-up stagger-4 space-y-4">
          <UserStats followers={userData.followers} following={userData.following} />
          <div className="glass-card p-4 flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30">
            <div>
              <h3 className="font-semibold text-foreground">Quotient Score</h3>
              <p className="text-xs text-muted-foreground">
                <a
                  href="https://docs.quotient.social/reputation/quotient-score#quotient-score"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Based on engagement quality
                </a>
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">{userData.quotient}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 opacity-0 animate-slide-up stagger-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={addToMiniApp}
              className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-border/50"
            >
              <div className="p-1 rounded-full bg-background/50 group-hover:bg-background/80 transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              Add App
            </button>
            <button
              onClick={shareApp}
              className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              Share
            </button>
          </div>

          <button
            onClick={() => sdk.actions.openUrl("https://warpcast.com/aleekhoso")}
            className="group relative flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-primary font-bold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="absolute -right-4 -top-4 h-12 w-12 bg-primary/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors animate-pulse-ring">
              <User className="h-5 w-5" />
            </div>
            <div className="relative flex flex-col items-start leading-none">
              <span className="text-sm">Follow Owner</span>
              <span className="text-[10px] text-muted-foreground opacity-80">@aleekhoso</span>
            </div>
            <div className="relative ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">PRO</div>
          </button>
        </div>

        <div className="space-y-4 opacity-0 animate-slide-up stagger-5">
          <CreatorTip />
          <DailyCheckin />
        </div>

        <div className="opacity-0 animate-slide-up stagger-5">
          <AppFooter />
        </div>
      </div>
    </main>
  )
}
