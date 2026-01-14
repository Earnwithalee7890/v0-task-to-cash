"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Loader2, User as UserIcon, AlertCircle } from "lucide-react"
import { ScoreDisplay } from "./score-display"
import { ReputationBadge } from "./reputation-badge"
import { SearchSkeleton } from "./search-skeleton"

import { ProfileStatsRow } from "./profile-stats-row"
import type { UserData } from "./truescore-app"

interface UserSearchPageProps {
    currentUser: UserData | null
}

export function UserSearchPage({ currentUser }: UserSearchPageProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchedUser, setSearchedUser] = useState<UserData | null>(null)
    const [isComparing, setIsComparing] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!searchQuery.trim()) {
            setError("Please enter a FID or username")
            return
        }

        setLoading(true)
        setError(null)
        setSearchedUser(null)
        setIsComparing(false)

        try {
            const response = await fetch(`/api/neynar/search?q=${encodeURIComponent(searchQuery.trim())}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "User not found")
            }

            const userData = await response.json()
            setSearchedUser(userData)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to search user")
            setSearchedUser(null)
        } finally {
            setLoading(false)
        }
    }

    // Comparison Logic
    const getWinner = (stat: keyof UserData) => {
        if (!currentUser || !searchedUser) return null
        // Handle potentially undefined values safely
        const currentVal = (currentUser[stat] as number) || 0
        const searchedVal = (searchedUser[stat] as number) || 0
        if (currentVal > searchedVal) return "current"
        if (searchedVal > currentVal) return "searched"
        return "draw"
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Search Header */}
            <div className="opacity-0 animate-slide-up stagger-1">
                <Card className="glass-card-strong p-5 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-400/40 box-glow-aqua">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg neon-glow-cyan">
                            <Search className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-foreground text-xl">Search Users</h3>
                        <p className="text-xs text-cyan-300/80">Find by FID or username</p>
                    </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter FID (e.g. 338060) or username"
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    )}
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg neon-glow-cyan"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </Button>
            </form>
        </Card>
            </div >

        {/* Error Message */ }
    {
        error && (
            <div className="opacity-0 animate-slide-up stagger-2">
                <Card className="glass-card-strong p-4 bg-red-500/10 border-2 border-red-400/40">
                    <div className="flex items-center gap-3 text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                </Card>
            </div>
        )
    }

    {/* Feature 10: Search Skeletons */ }
    {
        loading && !searchedUser && (
            <SearchSkeleton />
        )
    }

    {/* Search Results */ }
    {
        searchedUser && (
            <div className="space-y-4">
                {/* Mode Toggle: View Profile vs Duel Mode */}
                {currentUser && searchedUser.fid !== currentUser.fid && (
                    <div className="flex justify-center opacity-0 animate-slide-up stagger-2">
                        <button
                            onClick={() => setIsComparing(!isComparing)}
                            className={`
                                    px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
                                    ${isComparing
                                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105"
                                    : "bg-white/10 text-white/70 hover:bg-white/20"}
                                `}
                        >
                            {isComparing ? (
                                <>⚔️ End Duel</>
                            ) : (
                                <>⚔️ Compare with Me</>
                            )}
                        </button>
                    </div>
                )}

                {!isComparing ? (
                    // Standard Profile View
                    <div className="space-y-4 animate-fade-in">
                        <div className="opacity-0 animate-slide-up stagger-2">
                            <Card className="glass-card-strong p-5 border-2 border-cyan-400/40">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={searchedUser.pfpUrl || "/placeholder-user.jpg"}
                                        alt={searchedUser.displayName}
                                        className="h-16 w-16 rounded-full border-2 border-cyan-400/60 ring-2 ring-cyan-400/30 object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-foreground text-xl">{searchedUser.displayName}</h3>
                                        <p className="text-sm text-muted-foreground">@{searchedUser.username}</p>
                                        <p className="text-xs text-cyan-300 mt-1">FID: {searchedUser.fid}</p>
                                    </div>
                                </div>

                                <ProfileStatsRow
                                    followers={searchedUser.followers}
                                    following={searchedUser.following}
                                    casts={searchedUser.casts || 0}
                                    replies={searchedUser.replies || 0}
                                />
                            </Card>
                        </div>

                        <div className="opacity-0 animate-slide-up stagger-3">
                            <ScoreDisplay score={searchedUser.score} />
                        </div>

                        <div className="flex justify-center opacity-0 animate-slide-up stagger-4">
                            <ReputationBadge reputation={searchedUser.reputation} />
                        </div>
                    </div>
                ) : (
                    // DUEL MODE ARENA
                    <div className="space-y-6 animate-fade-in">
                        {/* Head-to-Head Header */}
                        <div className="flex items-center justify-center gap-4 py-4">
                            <div className="text-center">
                                <img src={currentUser?.pfpUrl} className="h-12 w-12 rounded-full border-2 border-green-400 mx-auto mb-1" />
                                <span className="text-xs font-bold text-green-400">YOU</span>
                            </div>
                            <div className="text-2xl font-black italic text-red-500 animate-pulse">VS</div>
                            <div className="text-center">
                                <img src={searchedUser.pfpUrl} className="h-12 w-12 rounded-full border-2 border-red-400 mx-auto mb-1" />
                                <span className="text-xs font-bold text-red-400">RIVAL</span>
                            </div>
                        </div>

                        {/* Score Duel */}
                        <Card className={`glass-card-strong p-4 border-2 ${getWinner('score') === 'current' ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <h4 className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-3">Neynar Score</h4>
                            <div className="flex items-center justify-between">
                                <div className={`text-2xl font-black ${getWinner('score') === 'current' ? 'text-green-400' : 'text-white/50'}`}>
                                    {currentUser?.score}
                                </div>
                                <div className={`text-2xl font-black ${getWinner('score') === 'searched' ? 'text-red-400' : 'text-white/50'}`}>
                                    {searchedUser.score}
                                </div>
                            </div>
                            {/* Progress Bar Visualization */}
                            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden flex">
                                <div className="h-full bg-green-500" style={{ width: `${(currentUser!.score / (currentUser!.score + searchedUser.score)) * 100}%` }} />
                                <div className="h-full bg-red-500" style={{ width: `${(searchedUser.score / (currentUser!.score + searchedUser.score)) * 100}%` }} />
                            </div>
                        </Card>

                        {/* Followers Duel */}
                        <Card className="glass-card-strong p-4 border border-white/10">
                            <h4 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-3">Followers</h4>
                            <div className="flex items-center justify-between">
                                <div className={`text-lg font-bold ${getWinner('followers') === 'current' ? 'text-green-400' : 'text-white/60'}`}>
                                    {currentUser?.followers}
                                </div>
                                <div className={`text-lg font-bold ${getWinner('followers') === 'searched' ? 'text-red-400' : 'text-white/60'}`}>
                                    {searchedUser.followers}
                                </div>
                            </div>
                        </Card>

                        {/* Casts Duel */}
                        <Card className="glass-card-strong p-4 border border-white/10">
                            <h4 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-3">Total Casts</h4>
                            <div className="flex items-center justify-between">
                                <div className={`text-lg font-bold ${getWinner('casts') === 'current' ? 'text-green-400' : 'text-white/60'}`}>
                                    {currentUser?.casts || 0}
                                </div>
                                <div className={`text-lg font-bold ${getWinner('casts') === 'searched' ? 'text-red-400' : 'text-white/60'}`}>
                                    {searchedUser.casts || 0}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        )
    }

    {/* Empty State */ }
    {
        !searchedUser && !error && !loading && (
            <div className="opacity-0 animate-slide-up stagger-2">
                <Card className="glass-card-strong p-8 text-center border-2 border-dashed border-cyan-400/30">
                    <UserIcon className="h-12 w-12 text-cyan-400/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                        Search for any Farcaster user by their FID or username
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                        Try searching: 338060, dwr, vitalik.eth
                    </p>
                </Card>

                {/* Feature 7: Quick Rivals */}
                {currentUser && (
                    <div className="mt-6">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Rivals</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { name: "dwr", label: "Dan Romero", fid: 3 },
                                { name: "vitalik.eth", label: "Vitalik", fid: 5650 },
                                { name: "v", label: "Varun", fid: 2 }
                            ].map((rival) => (
                                <button
                                    key={rival.name}
                                    onClick={() => {
                                        setSearchQuery(rival.name)
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-center transition-colors hover:border-cyan-500/30"
                                >
                                    <div className="font-bold text-cyan-300">VS {rival.label}</div>
                                    <div className="text-[10px] text-muted-foreground/50">@{rival.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }
        </div >
    )
}
