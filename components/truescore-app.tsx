"use client"

import { useState, useEffect, useCallback } from "react"
import { HomePage } from "./home-page"
import { ProfilePage } from "./profile-page"
import { Navigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { ClickSpark } from "./click-spark"
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
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home")

  const updateUserData = async (data: any, fid: number) => {
    // Fetch real Quotient Score from API
    let quotientScore = 0
    try {
      const quotientRes = await fetch("/api/quotient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid }),
      })
      if (quotientRes.ok) {
        const quotientData = await quotientRes.json()
        quotientScore = quotientData.quotientScore || 0
      }
    } catch (err) {
      console.error("Failed to fetch Quotient score:", err)
    }

    const lastQuotient = Number(localStorage.getItem("lastQuotient") ?? "-1")
    if (lastQuotient !== -1 && lastQuotient !== quotientScore) {
      const lastNotified = Number(localStorage.getItem("lastNotified") ?? "0")
      const now = Date.now()
      if (now - lastNotified > 7 * 24 * 60 * 60 * 1000) {
        setShowScoreUpdate(true)
        localStorage.setItem("lastNotified", now.toString())
      }
    }
    localStorage.setItem("lastQuotient", quotientScore.toString())
    setUserData({ ...data, quotient: quotientScore })
  }

  const fetchUserData = useCallback(async (fid: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/neynar/user?fid=${fid}`)
      if (!response.ok) throw new Error("Failed to fetch user data")
      const data = await response.json()
      await updateUserData(data, fid)
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
    const text = `Check out my TrueScore! Neynar Score: ${userData?.score} | Quotient Score: ${userData?.quotient.toFixed(2)}`
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
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-5/5 pointer-events-none" />
        <div className="relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
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
          <p>Your Quotient score has been updated this week! Check the new score.</p>
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

        {activeTab === "home" ? (
          <HomePage
            userData={userData}
            onAddToMiniApp={addToMiniApp}
            onShare={shareApp}
          />
        ) : (
          <ProfilePage userData={userData} />
        )}

        <div className="opacity-0 animate-slide-up stagger-5">
          <AppFooter />
        </div>
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
