"use client"

import { useEffect, useState } from "react"
import { X, Sparkles, Gift, Zap, Bell, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NewsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NewsModal({ isOpen, onClose }: NewsModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const updates = [
        {
            title: "Lucky Spin Wheel",
            description: "Test your luck daily! Spin nicely to win XP, Badges or even Gas rebates.",
            icon: <Gift className="h-5 w-5 text-pink-400" />,
            date: "New"
        },
        {
            title: "2025 Year Reback",
            description: "Relive your best Farcaster moments from 2025 with our interactive year in review.",
            icon: <Calendar className="h-5 w-5 text-violet-400" />,
            date: "New"
        },
        {
            title: "Base Gas Tracker",
            description: "Monitor real-time Base network gas prices directly from your home screen.",
            icon: <Zap className="h-5 w-5 text-yellow-400" />,
            date: "Update"
        }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-[#0D1117] border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-6 pb-2">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    <Bell className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">What's New</h2>
                                    <p className="text-sm text-muted-foreground">Latest updates & features</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-2 space-y-4">
                            {updates.map((update, index) => (
                                <div
                                    key={index}
                                    className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            {update.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                                    {update.title}
                                                </h3>
                                                {update.date === "New" && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                {update.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-2">
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
                            >
                                <span>Awesome!</span>
                                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
