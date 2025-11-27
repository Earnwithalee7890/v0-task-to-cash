"use client"

import { useState, useEffect, useCallback } from "react"
import { ScoreDisplay } from "./score-display"
import { UserStats } from "./user-stats"
import { ReputationBadge } from "./reputation-badge"
import { TipButton } from "./tip-button"
import { DailyCheckin } from "./daily-checkin"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { Skeleton } from "@/components/ui/skeleton"
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
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const fetchUserData = useCallback(async (fid: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/neynar/user?fid=${fid}`)
      if (!response.ok) throw new Error("Failed to fetch user data")
      const data = await response.json()
      setUserData(data)
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

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const frameContext = await sdk.context
        setContext(frameContext)

        // Set theme from Farcaster client
        if (frameContext?.client?.theme) {
          const fcTheme = frameContext.client.theme === "dark" ? "dark" : "light"
          setTheme(fcTheme)
          document.documentElement.classList.toggle("dark", fcTheme === "dark")
        }

        // Fetch user data
        if (frameContext?.user?.fid) {
          await fetchUserData(frameContext.user.fid)
        } else {
          await fetchUserData(338060)
        }

        // Signal ready after data is loaded
        await sdk.actions.ready()
        setIsSDKLoaded(true)
      } catch (err) {
        console.error("SDK initialization error:", err)
        setIsSDKLoaded(true)
        await fetchUserData(338060)
      }
    }

    initializeSDK()
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

      <div className="relative mx-auto max-w-md space-y-8">
        {/* Header with Theme Toggle */}
        <header className="opacity-0 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10" />
            <div className="inline-flex items-center gap-2">
              <img src="/trustscore-logo.png" alt="TrustScore" className="h-10 w-auto" />
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <p className="text-sm text-muted-foreground text-center">Your real Neynar reputation</p>
        </header>

        {/* User Info */}
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

        {/* Score Display */}
        <div className="opacity-0 animate-slide-up stagger-2">
          <ScoreDisplay score={userData.score} />
        </div>

        {/* Reputation Badge */}
        <div className="flex justify-center opacity-0 animate-slide-up stagger-3">
          <ReputationBadge reputation={userData.reputation} />
        </div>

        <div className="opacity-0 animate-slide-up stagger-4">
          <UserStats followers={userData.followers} following={userData.following} />
        </div>

        {/* Tip & Check-in */}
        <div className="space-y-4 opacity-0 animate-slide-up stagger-5">
          <TipButton />
          <DailyCheckin />
        </div>

        {/* Footer */}
        <div className="opacity-0 animate-slide-up stagger-5">
          <AppFooter />
        </div>
      </div>
    </main>
  )
}
