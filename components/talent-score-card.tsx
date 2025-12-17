"use client"

import { motion } from "framer-motion"
import { Users, CheckCircle2, UserCheck, ShieldCheck, Zap } from "lucide-react"

interface TalentScoreCardProps {
    builderScore?: number
    creatorScore?: number
    farcasterRevenue?: number
    isHuman?: boolean
    isVerified?: boolean
    handle?: string
}

export function TalentScoreCard({ builderScore, creatorScore, farcasterRevenue, isHuman, isVerified, handle }: TalentScoreCardProps) {
    if (builderScore === undefined && creatorScore === undefined) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-6 rounded-2xl neon-border-purple overflow-hidden relative"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-16 -mt-16" />

            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {/* Builder Score */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-purple-300">
                                <Zap className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Builder Score</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">{builderScore || 0}</span>
                                <span className="text-[10px] text-purple-300/60">/100</span>
                            </div>
                        </div>

                        {/* Creator Score */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-pink-300">
                                <Users className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Creator Score</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">{creatorScore || 0}</span>
                                <span className="text-[10px] text-pink-300/60">/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Farcaster Earnings Summary */}
                {farcasterRevenue !== undefined && (
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest text-center">Farcaster Total Earnings</span>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl font-black text-green-400 font-mono tracking-tighter">${farcasterRevenue.toLocaleString()}</span>
                            <span className="text-xs text-green-400/60 font-bold uppercase">usdc</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                    {isHuman && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[9px] font-bold text-green-400 uppercase tracking-tighter">
                            <UserCheck className="h-2.5 w-2.5" />
                            Human Verified
                        </div>
                    )}
                    {isVerified && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            Verified
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold">
                <span>Data Source</span>
                <span className="text-purple-400/80">Talent Protocol v3</span>
            </div>
        </motion.div>
    )
}
