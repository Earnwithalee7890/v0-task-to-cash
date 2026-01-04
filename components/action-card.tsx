"use client"

import { Plus, User } from "lucide-react"
import { SocialShareButtons } from "./social-share-buttons"
import sdk from "@farcaster/frame-sdk"

interface ActionCardProps {
    userData: {
        fid: number
        score: number
    }
    onAddToMiniApp: () => void
    onShareLinkedIn?: () => void
}

export function ActionCard({ userData, onAddToMiniApp, onShareLinkedIn }: ActionCardProps) {
    return (
        <div className="glass-card-strong p-5 rounded-2xl space-y-4 neon-border">
            {/* Add App Button */}
            <button
                onClick={onAddToMiniApp}
                className="glass-neon-button glossy-overlay w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-semibold text-white"
            >
                <Plus className="h-5 w-5" />
                Add App
            </button>

            {/* Follow Owner Button */}
            <button
                onClick={() => sdk.actions.openUrl("https://warpcast.com/aleekhoso")}
                className="group relative w-full flex items-center justify-center gap-3 h-14 rounded-full neon-border bg-secondary/20 backdrop-blur-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-500/10" />
                <User className="h-6 w-6 text-cyan-300 relative" />
                <div className="relative flex flex-col items-start leading-tight">
                    <span className="text-sm text-cyan-200">Follow Developer</span>
                    <span className="text-[10px] text-cyan-300/60">@aleekhoso</span>
                </div>
                <div className="relative px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-[10px] font-bold text-black letter-space-wide">PRO</div>
            </button>

            {/* Social Buttons */}
            <SocialShareButtons
                userData={userData}
                onShareLinkedIn={onShareLinkedIn}
            />
        </div>
    )
}
