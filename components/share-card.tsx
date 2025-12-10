"use client"

import { Share2 } from "lucide-react"
import { FaXTwitter } from "react-icons/fa6"

interface ShareCardProps {
    score: number
    reputation: string
    onShareFarcaster?: () => void
    onShareX?: () => void
}

export function ShareCard({ score, reputation, onShareFarcaster, onShareX }: ShareCardProps) {
    const handleShareX = () => {
        const text = `My TrueScore: ${score} | Reputation: ${reputation.toUpperCase()} 🎯\n\nCheck yours on Farcaster!`
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        window.open(url, "_blank")
        onShareX?.()
    }

    return (
        <div className="glass-card-strong p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground text-center text-shadow-sm">Share Your Score</h3>

            {/* Score Preview */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 border-2 border-purple-500/30 neon-glow-purple">
                <div className="text-center">
                    <p className="text-6xl font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                        {score}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Your TrueScore</p>
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mt-2">
                        {reputation.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onShareFarcaster}
                    className="w-full py-4 rounded-xl btn-gradient-purple text-white font-semibold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                    <Share2 className="w-5 h-5" />
                    <span>Share on Farcaster</span>
                </button>

                <button
                    onClick={handleShareX}
                    className="w-full py-4 rounded-xl btn-gradient-cyan text-white font-semibold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                    <FaXTwitter className="w-5 h-5" />
                    <span>Share on X</span>
                </button>
            </div>
        </div>
    )
}
