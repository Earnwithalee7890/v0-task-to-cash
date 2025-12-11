"use client"

import { useState, useEffect, useCallback } from "react"
import { HomePage } from "./home-page"
import { ProfilePage } from "./profile-page"
import { Navigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { ClickSpark } from "./click-spark"
import { AnimatedBackground } from "./animated-background"
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
  casts?: number
  replies?: number
  verifiedAddresses: string[]
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
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

  const addToMiniApp = useCallback(async () => {
    try {
      console.log("Add to Mini App clicked")
      await sdk.actions.addFrame()
      console.log("Successfully added to mini app")
      setShowAddPrompt(false)
    } catch (error) {
      console.error("Error adding to mini app:", error)
      // Show alert to user about the error
      alert("Unable to add to mini app. Please try again or add manually from Farcaster settings.")
    }
  }, [])

  const shareApp = useCallback(() => {
    if (!userData) return
    const text = `Check out my TrueScore! 🎯\n\nNeynar Score: ${userData.score}\nReputation: ${userData.reputation.toUpperCase()}\n\nGet your score 👇`
    const baseUrl = "https://v0-task-to-cash-seven.vercel.app"
    // Only pass FID - the share page and OG image will fetch live data
    // Add timestamp to force fresh fetch and bypass Farcaster cache
    const timestamp = Date.now()
    const shareUrl = `${baseUrl}/share?fid=${userData.fid}&t=${timestamp}`
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
      <AnimatedBackground theme={theme}>
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="relative text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
            <p className="mt-4 text-sm text-white/80 text-shadow-md">Loading...</p>
          </div>
        </main>
      </AnimatedBackground>
    )
  }

  if (error) {
    return (
      <AnimatedBackground theme={theme}>
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="relative text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-white text-shadow-md mb-2">TrustScore</h1>
            <p className="text-red-400 text-shadow-sm">{error}</p>
          </div>
        </main>
      </AnimatedBackground>
    )
  }

  if (!userData) return null

  return (
    <AnimatedBackground theme={theme}>
      <main className="min-h-screen px-4 py-8 overflow-hidden">
        {showAddPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="glass-card-strong p-6 shadow-2xl max-w-sm w-full mx-4">
              <h2 className="text-xl font-semibold mb-4 text-foreground text-shadow-sm">Add TrueScore Mini App</h2>
              <p className="text-muted-foreground mb-4">Add this mini app to your Farcaster feed for quick access.</p>
              <button
                onClick={addToMiniApp}
                className="w-full py-3 btn-gradient-purple text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all"
              >
                Add Mini App
              </button>
            </div>
          </div>
        )}



        <div className="relative mx-auto max-w-md space-y-6">
          <header className="opacity-0 animate-fade-in text-center">
            <ClickSpark />

            {/* TrueScore Title with Neon Glow */}
            <h1 className="text-4xl font-bold mb-2 neon-glow-aqua letter-space-wide">
              TRUESCORE
            </h1>
            <p className="text-sm text-cyan-200/80 mb-6">Your Farcaster Reputation</p>

            {/* Profile Picture & Theme Toggle */}
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="relative group cursor-pointer neon-ring" onClick={() => setActiveTab("profile")}>
                <div className="absolute inset-0 box-glow-aqua rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={userData.pfpUrl || "/placeholder-user.jpg"}
                  alt={userData.displayName}
                  className="relative h-10 w-10 rounded-full border-2 border-cyan-400/60 ring-2 ring-cyan-400/30 object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
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
    </AnimatedBackground>
  )
}
