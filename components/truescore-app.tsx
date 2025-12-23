"use client"

import { useState, useEffect, useCallback } from "react"
import { HomePage } from "./home-page"
import { ProfilePage } from "./profile-page"
import { UserSearchPage } from "./user-search-page"
import { AIPage } from "./ai-page"
import { Navigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"
import { AppFooter } from "./app-footer"
import { ClickSpark } from "./click-spark"
import { AnimatedBackground } from "./animated-background"
import { OnboardingModal } from "./onboarding-modal"
import { Skeleton } from "@/components/ui/skeleton"
import sdk from "@farcaster/frame-sdk"

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
  const [context, setContext] = useState<any | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "search" | "ai">("home")
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("truescore_onboarding_seen")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleCloseOnboarding = () => {
    localStorage.setItem("truescore_onboarding_seen", "true")
    setShowOnboarding(false)
  }

  const updateUserData = async (data: any, fid: number) => {
    // Explicitly ensure FID is in userData, even if API doesn't return it
    setUserData({ ...data, fid })
  }

  const fetchUserData = useCallback(async (fid: number) => {
    try {
      setLoading(true)
      console.log('Fetching user data for FID:', fid)
      const response = await fetch(`/api/neynar/user?fid=${fid}`)
      if (!response.ok) throw new Error("Failed to fetch user data")
      const data = await response.json()
      console.log('Received user data:', data)
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

  // Helper function to get FID from URL parameters
  const getFidFromUrl = (): number | null => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const fidParam = params.get('fid')
    return fidParam ? Number(fidParam) : null
  }

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
    console.log('Share button clicked. UserData:', userData)
    console.log('Sharing with FID:', userData.fid)
    const text = `Check out my TrueScore! 🎯\n\nNeynar Score: ${userData.score}\nReputation: ${userData.reputation.toUpperCase()}\n\nGet your score 👇`
    const baseUrl = "https://v0-task-to-cash-seven.vercel.app"
    // Add timestamp to force Farcaster to bypass cache and fetch fresh image
    const timestamp = Date.now()
    const shareUrl = `${baseUrl}/share?fid=${userData.fid}&_=${timestamp}`
    console.log('Generated share URL:', shareUrl)
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`)
  }, [userData])

  useEffect(() => {
    const init = async () => {
      try {
        console.log('[INIT] Starting SDK initialization...')
        const frameContext = await sdk.context
        console.log('[INIT] Full frameContext:', frameContext)
        console.log('[INIT] frameContext.user:', frameContext?.user)
        console.log('[INIT] frameContext.user.fid:', frameContext?.user?.fid)

        setContext(frameContext)
        if ((frameContext?.client as any)?.theme) {
          const fcTheme = (frameContext.client as any).theme === "dark" ? "dark" : "light"
          setTheme(fcTheme)
          document.documentElement.classList.toggle("dark", fcTheme === "dark")
        }

        // Try multiple sources for FID, in priority order:
        // 1. SDK context (most reliable)
        // 2. URL parameter (for share links)
        // 3. Show demo with owner FID (encourage adding mini app)
        let fid = frameContext?.user?.fid

        if (!fid) {
          console.log('[INIT] No FID from SDK context, checking URL...')
          const urlFid = getFidFromUrl()
          if (urlFid) {
            console.log('[INIT] Found FID in URL:', urlFid)
            fid = urlFid
          } else {
            console.log('[INIT] No FID found - showing demo with owner score')
            // Show owner score as demo, with subtle prompt to add for personalized score
            fid = 338060
            setShowAddPrompt(true) // Non-blocking prompt
          }
        }

        console.log('[INIT] Final FID to use:', fid)
        await fetchUserData(fid)
        await sdk.actions.ready()
        setIsSDKLoaded(true)
      } catch (e) {
        console.error("SDK init error", e)
        setIsSDKLoaded(true)
        // Try URL parameter even on error
        const urlFid = getFidFromUrl()
        await fetchUserData(urlFid || 338060)
      }
    }
    init()
  }, [fetchUserData])

  if (loading) {
    return (
      <AnimatedBackground theme={theme}>
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="relative">
            {/* Elegant pulsing gradient circle - no logo/text */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse-glow opacity-60" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-spin-slow opacity-80" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 rounded-full bg-background" />
            </div>
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
          <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
            <div className="glass-card-strong p-4 shadow-xl flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm mb-1">Get Your Personal Score</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Add this mini app to see your own TrueScore
                </p>
                <button
                  onClick={addToMiniApp}
                  className="text-xs py-1.5 px-3 btn-gradient-purple text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all"
                >
                  Add Mini App
                </button>
              </div>
              <button
                onClick={() => setShowAddPrompt(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
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
          ) : activeTab === "search" ? (
            <UserSearchPage />
          ) : activeTab === "ai" ? (
            <AIPage userData={userData} />
          ) : (
            <ProfilePage userData={userData} />
          )}

          <div className="opacity-0 animate-slide-up stagger-5">
            <AppFooter />
          </div>
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <OnboardingModal
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
        />
      </main>
    </AnimatedBackground>
  )
}
