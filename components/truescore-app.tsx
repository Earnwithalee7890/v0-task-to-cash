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
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home")

  const updateUserData = async (data: any, fid: number) => {
    setUserData({ ...data })
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
    if (!userData) return
    const text = `Check out my TrueScore! 🎯\n\nNeynar Score: ${userData.score}\nReputation: ${userData.reputation.toUpperCase()}\n\nGet your score 👇`
    const baseUrl = "https://v0-task-to-cash-seven.vercel.app"
    // Only pass FID - the share page and OG image will fetch live data
    const shareUrl = `${baseUrl}/share?fid=${userData.fid}`
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`)
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



      <div className="relative mx-auto max-w-md space-y-8">
        <header className="opacity-0 animate-fade-in">
          <ClickSpark />
          <div className="flex items-center justify-between mb-4">
            {/* User Profile Picture */}
            <div className="relative group cursor-pointer" onClick={() => setActiveTab("profile")}>
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={userData.pfpUrl || "/placeholder-user.jpg"}
                alt={userData.displayName}
                className="relative h-10 w-10 rounded-full border-2 border-primary/50 ring-2 ring-primary/20 object-cover transition-transform group-hover:scale-105"
              />
            </div>
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
