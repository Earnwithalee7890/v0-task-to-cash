"use client"

import { useState } from "react"
import { UserStats } from "./user-stats"
import { DailyCheckin } from "./daily-checkin"
import { CreatorTip } from "./creator-tip"
import { ScoreHistory } from "./score-history"
import { RivalComparisonModal } from "./rival-comparison-modal"
import { BioGenerator } from "./bio-generator"
import { PowerCard } from "./power-card"
import { BuilderResources } from "./builder-resources"
import { Swords, Copy, Check, Download } from "lucide-react"
import { toast } from "sonner"
import type { UserData } from "./truescore-app"

interface ProfilePageProps {
    userData: UserData
}

function CopyButton({ address }: { address: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        toast.success("Address copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Copy Address"
        >
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </button>
    )
}

function ExportButton({ userData }: { userData: UserData }) {
    const handleExport = () => {
        const headers = ["FID", "Username", "Display Name", "Score", "Reputation", "Followers", "Following"]
        const values = [
            userData.fid,
            userData.username,
            userData.displayName,
            userData.score,
            userData.reputation,
            userData.followers,
            userData.following
        ]

        const csvContent = [
            headers.join(","),
            values.join(",")
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `truescore_${userData.username}_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Stats exported to CSV")
    }

    return (
        <button
            onClick={handleExport}
            className="mt-2 text-[10px] text-muted-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
            <Download className="h-3 w-3" />
            Export Stats
        </button>
    )
}

export function ProfilePage({ userData }: ProfilePageProps) {
    const [showRivalModal, setShowRivalModal] = useState(false)

    return (
        <div className="space-y-6 pb-24">
            {/* User Info */}
            <div className="flex items-center justify-center gap-4 opacity-0 animate-slide-up stagger-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
                    <img
                        src={userData.pfpUrl || "/placeholder.svg"}
                        alt={userData.displayName}
                        className="relative h-20 w-20 rounded-full border-2 border-primary/50 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-transform hover:scale-105"
                        loading="eager"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-xl text-foreground">{userData.displayName}</p>
                    <p className="text-sm text-muted-foreground mb-2">@{userData.username}</p>
                    {userData.bio && (
                        <p className="text-xs text-center text-muted-foreground/80 max-w-[250px] leading-relaxed line-clamp-3 mb-3">
                            {userData.bio}
                        </p>
                    )}
                    <button
                        onClick={() => setShowRivalModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                    >
                        <Swords className="h-3 w-3" />
                        Battle a Friend
                    </button>

                    {/* Wallet Address Copy Feature */}
                    {userData.verifiedAddresses && userData.verifiedAddresses.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-secondary/30 rounded-full border border-white/5">
                            <span className="text-xs text-muted-foreground font-mono">
                                {userData.verifiedAddresses[0].slice(0, 6)}...{userData.verifiedAddresses[0].slice(-4)}
                            </span>
                            <CopyButton address={userData.verifiedAddresses[0]} />
                        </div>
                    )}

                    {/* Export Stats Button */}
                    <ExportButton userData={userData} />
                </div>
            </div>

            <RivalComparisonModal
                isOpen={showRivalModal}
                onClose={() => setShowRivalModal(false)}
                currentUser={userData}
            />

            {/* Followers/Following Stats */}
            <div className="opacity-0 animate-slide-up stagger-2">
                <UserStats followers={userData.followers} following={userData.following} />
            </div>

            {/* Daily Check-in */}
            <div className="opacity-0 animate-slide-up stagger-3">
                <DailyCheckin />
            </div>

            {/* Tip the Creator */}
            <div className="opacity-0 animate-slide-up stagger-4">
                <CreatorTip />
            </div>

            {/* Feature 5: Bio Generator */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <BioGenerator score={userData.score} rank={userData.score * 10} followers={userData.followers} />
            </div>

            {/* Feature 8: Power Card */}
            <div className="opacity-0 animate-slide-up stagger-5">
                <PowerCard userData={userData} />
            </div>

            {/* Feature 13: Build on Base Resources */}
            <div className="opacity-0 animate-slide-up stagger-6">
                <BuilderResources />
            </div>
        </div>
    )
}
