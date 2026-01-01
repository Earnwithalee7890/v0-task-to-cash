"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Trophy, Swords, Loader2, AlertCircle } from "lucide-react"
import type { UserData } from "./truescore-app"
import { Button } from "@/components/ui/button"

interface RivalComparisonModalProps {
    isOpen: boolean
    onClose: () => void
    currentUser: UserData
}

export function RivalComparisonModal({ isOpen, onClose, currentUser }: RivalComparisonModalProps) {
    const [query, setQuery] = useState("")
    const [rival, setRival] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setRival(null)

        try {
            const response = await fetch(`/api/neynar/search?q=${encodeURIComponent(query.trim())}`)
            if (!response.ok) throw new Error("User not found")
            const data = await response.json()
            if (data.fid === currentUser.fid) throw new Error("You can't battle yourself!")
            setRival(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to find rival")
        } finally {
            setLoading(false)
        }
    }

    const getWinner = (stat: keyof UserData) => {
        if (!rival) return null
        const currentVal = (currentUser[stat] as number) || 0
        const rivalVal = (rival[stat] as number) || 0
        if (currentVal > rivalVal) return "current"
        if (rivalVal > currentVal) return "rival"
        return "draw"
    }

    const StatRow = ({ label, stat, icon: Icon }: { label: string, stat: keyof UserData, icon: any }) => {
        const winner = getWinner(stat)
        const currentVal = (currentUser[stat] as number) || 0
        const rivalVal = rival ? ((rival[stat] as number) || 0) : 0

        return (
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                    <Icon className="h-3 w-3" />
                </div>
                <div className="flex items-center justify-between font-bold text-lg">
                    <span className={winner === "current" ? "text-green-400" : "text-white/60"}>
                        {currentVal.toLocaleString()}
                    </span>
                    <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden mx-2">
                        <div
                            className={`h-full ${winner === "current" ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${(currentVal / (currentVal + rivalVal)) * 100}%` }}
                        />
                    </div>
                    <span className={winner === "rival" ? "text-red-400" : "text-white/60"}>
                        {rivalVal.toLocaleString()}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-[#1a1b26] border-2 border-red-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Swords className="h-5 w-5 text-red-400" />
                            <h2 className="font-bold text-lg text-white">Rival Battle</h2>
                        </div>
                        <button onClick={onClose} className="text-white/50 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        {!rival ? (
                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-400">Enter a username to compare stats</p>
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="e.g. dwr.eth"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500/50 outline-none"
                                    />
                                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    </Button>
                                </form>
                                {error && (
                                    <div className="flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Avatars Face-off */}
                                <div className="flex items-center justify-around">
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full" />
                                            <img src={currentUser.pfpUrl} className="relative h-16 w-16 rounded-full border-2 border-green-500 shadow-xl" />
                                        </div>
                                        <span className="mt-2 font-bold text-sm text-green-400">YOU</span>
                                    </div>
                                    <div className="text-2xl font-black text-white/20 italic">VS</div>
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full" />
                                            <img src={rival.pfpUrl} className="relative h-16 w-16 rounded-full border-2 border-red-500 shadow-xl" />
                                        </div>
                                        <span className="mt-2 font-bold text-sm text-red-400">{rival.displayName}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-1">
                                    <StatRow label="Neynar Score" stat="score" icon={Trophy} />
                                    <StatRow label="Followers" stat="followers" icon={Swords} />
                                    <StatRow label="Casts" stat="casts" icon={Search} />
                                </div>

                                <Button
                                    onClick={() => setRival(null)}
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 text-white/60"
                                >
                                    New Battle
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
