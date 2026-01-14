"use client"

import { useState, useEffect, useCallback } from "react"
import { HomePage } from "./home-page"
import { ProfilePage } from "./profile-page"
import { UserSearchPage } from "./user-search-page"
import { AIPage } from "./ai-page"
import { Navigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"
import { ActivityTicker } from "./activity-ticker"
import { AppFooter } from "./app-footer"
import { Eye, EyeOff, Info } from "lucide-react"
import { ClickSpark } from "./click-spark"
import { AnimatedBackground } from "./animated-background"
import { OnboardingModal } from "./onboarding-modal"
import { AboutModal } from "./about-modal"

import { MatrixRain } from "./matrix-rain"
import { NewsModal } from "./news-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { PowerCardSkeleton } from "@/components/power-card-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
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
  bio?: string
  activeStatus?: string
  powerBadge?: boolean
}

export function TrueScoreApp() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "cyberpunk">("dark")
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "search" | "ai">("home")
  const [showOnboarding, setShowOnboarding] = useState(false)

  const [isZenMode, setIsZenMode] = useState(false)
  const [matrixClicks, setMatrixClicks] = useState(0)
  const [showMatrix, setShowMatrix] = useState(false)

  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showNewsModal, setShowNewsModal] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("truescore_onboarding_seen")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    // Check for News Modal
    const hasSeenNews = localStorage.getItem("truescore_news_seen_v1")
    if (!hasSeenNews && hasSeenOnboarding) { // Only show if onboarding is done/already seen
      // Small delay to not overwhelm
      setTimeout(() => setShowNewsModal(true), 1500)
    }
  }, [])

  const handleCloseOnboarding = () => {
    localStorage.setItem("truescore_onboarding_seen", "true")
    setShowOnboarding(false)

    // Show news after onboarding if not seen
    const hasSeenNews = localStorage.getItem("truescore_news_seen_v1")
    if (!hasSeenNews) {
      setTimeout(() => setShowNewsModal(true), 500)
    }
  }

  const handleCloseNews = () => {
    localStorage.setItem("truescore_news_seen_v1", "true")
    setShowNewsModal(false)
  }

  const handleCloseYearReback = () => {
    localStorage.setItem("truescore_year_reback_seen_2025", "true")
    setShowYearReback(false)
  }

  // Fetch Year Reback Data
  const fetchYearReback = useCallback(async (fid: number) => {
    const hasSeenReback = localStorage.getItem("truescore_year_reback_seen_2025")
    if (hasSeenReback) return

    try {
      const response = await fetch(`/api/neynar/year-review?fid=${fid}`)
      if (response.ok) {
        const data = await response.json()
        setYearRebackData(data)
        setShowYearReback(true)
      }
    } catch (e) {
      console.error("Failed to fetch year reback", e)
    }
  }, [])

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
      const newTheme = prev === "light" ? "dark" : prev === "dark" ? "cyberpunk" : "light"
      // Handle DOM class changes
      document.documentElement.classList.remove("light", "dark", "cyberpunk")
      document.documentElement.classList.add(newTheme)
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
    const text = `Track your Farcaster reputation with TrueScore! 🎯\n\nNeynar Score: ${userData.score}\nReputation: ${userData.reputation.toUpperCase()}\n\nCheck your score 👇`
    const baseUrl = "https://v0-task-to-cash-seven.vercel.app"
    // Add timestamp to force Farcaster to bypass cache and fetch fresh image
    const timestamp = Date.now()
    const shareUrl = `${baseUrl}/share?fid=${userData.fid}&_=${timestamp}`
    console.log('Generated share URL:', shareUrl)
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`)
  }, [userData])

  const shareOnBase = useCallback(async () => {
    const text = `Track your Farcaster reputation with TrueScore! 🎯\n\nReal-time Neynar scores & analytics 📊\n\nJoin me on Base: https://base.app/app/v0-task-to-cash-seven.vercel.app`
    const baseAppUrl = "https://base.app/app/v0-task-to-cash-seven.vercel.app"

    // Use native share so users can choose Base app, Farcaster, or other apps
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrueScore - Track Your Reputation',
          text: text
        })
      } catch (err) {
        // User cancelled or share failed, fallback to Warpcast
        console.log('Share cancelled, opening Warpcast as fallback')
        sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(baseAppUrl)}`)
      }
    } else {
      // No native share, use Warpcast
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(baseAppUrl)}`)
    }
  }, [])

  const shareOnLinkedIn = useCallback(() => {
    if (!userData) return
    const text = `I just checked my Farcaster reputation on TrueScore! \n\nNeynar Score: ${userData.score}\nReputation: ${userData.reputation.toUpperCase()}\n\nCheck yours here: https://v0-task-to-cash-seven.vercel.app`
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
    window.open(linkedinUrl, '_blank')
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
        // Check for Year Reback
        fetchYearReback(fid)
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
        <main className="min-h-screen px-4 py-8">
          <div className="relative mx-auto max-w-md space-y-6">
            {/* Fake header to match layout during load */}
            <div className="flex justify-center mb-6">
              <Skeleton className="h-8 w-48 rounded" />
            </div>

            {/* Power Card Skeleton */}
            <PowerCardSkeleton />

            <div className="space-y-4 mt-8">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
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
          <ActivityTicker />
          {showMatrix && <MatrixRain />}

          <header className="opacity-0 animate-fade-in text-center">
            <ClickSpark />

            {/* TrueScore Title with Neon Glow */}
            <h1
              onClick={() => {
                const newCount = matrixClicks + 1
                setMatrixClicks(newCount)
                if (newCount === 5) {
                  setShowMatrix(true)
                  setTimeout(() => {
                    setShowMatrix(false)
                    setMatrixClicks(0)
                  }, 5000)
                }
              }}
              className="text-4xl font-bold mb-2 neon-glow-aqua letter-space-wide select-none cursor-pointer active:scale-95 transition-transform animate-pulse"
            >
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
                  loading="eager"
                  className="relative h-10 w-10 rounded-full border-2 border-cyan-400/60 ring-2 ring-cyan-400/30 object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (userData) fetchUserData(userData.fid)
                  }}
                  disabled={loading}
                  className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 text-cyan-400 transition-colors disabled:opacity-50"
                  title="Refresh Data"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={loading ? "animate-spin" : ""}
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsZenMode(!isZenMode)}
                  className={`p-2 rounded-full transition-colors ${isZenMode ? "bg-cyan-500/20 text-cyan-400" : "bg-secondary/20 hover:bg-secondary/40 text-muted-foreground"}`}
                  title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                >
                  {isZenMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setShowAboutModal(true)}
                  className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 text-muted-foreground hover:text-cyan-400 transition-colors"
                  title="About TrueScore"
                >
                  <Info className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowNewsModal(true)}
                  className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 text-muted-foreground hover:text-cyan-400 transition-colors"
                  title="What's New"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                </button>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </header>

          {activeTab === "home" ? (
            isZenMode ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                  {userData.score}
                </div>
                <div className="text-xl text-muted-foreground tracking-widest uppercase">Neynar Score</div>
              </div>
            ) : (
              <HomePage
                userData={userData}
                onAddToMiniApp={addToMiniApp}
                onShare={shareApp}
                onShareBase={shareOnBase}
                onShareLinkedIn={shareOnLinkedIn}
                onShowYearReback={() => setShowYearReback(true)}
                onRefresh={() => fetchUserData(userData.fid)}
              />
            )
          ) : activeTab === "search" ? (
            <UserSearchPage currentUser={userData} />
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

        <AboutModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />

        <NewsModal
          isOpen={showNewsModal}
          onClose={handleCloseNews}
        />

        <YearRebackModal
          isOpen={showYearReback}
          onClose={handleCloseYearReback}
          data={yearRebackData}
          onShare={() => {
            const text = `Check out my 2025 Year in Reback on TrueScore! 🎯\n\nRank: ${yearRebackData?.rank}\nScore: ${yearRebackData?.score}\nFollowers: ${yearRebackData?.followers}\n\nSee yours 👇`
            const shareUrl = "https://v0-task-to-cash-seven.vercel.app"
            sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`)
          }}
        />

        <ScrollToTop />
      </main>
    </AnimatedBackground>
  )
}
