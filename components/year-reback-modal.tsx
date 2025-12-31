"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Calendar, Trophy, Heart, Star, Share2, Users, Mic, Sparkles, Compass, Zap, Clock } from "lucide-react"

interface YearRebackData {
    username: string
    displayName: string
    pfpUrl: string
    score: number
    rank: string
    activeDays: number
    totalLikes: number
    followers: number
    castsCount: number
    peakHour?: number
    peakDay?: string
    topCast: {
        text: string
        likes: number
        replies: number
        date: string
    } | null
}

interface YearRebackModalProps {
    isOpen: boolean
    onClose: () => void
    data: YearRebackData | null
    onShare: () => void
}

export function YearRebackModal({ isOpen, onClose, data, onShare }: YearRebackModalProps) {
    const [currentStep, setCurrentStep] = useState(0)

    if (!isOpen || !data) return null

    // Determine Persona
    let persona = "The Lurker"
    let personaDesc = "Observing from the shadows."
    let personaIcon = <Users className="h-10 w-10 text-gray-400" />

    // Sample based logic since we have limit=150
    if (data.castsCount > 50) {
        persona = "The Voice"
        personaDesc = "You had a lot to say this year!"
        personaIcon = <Mic className="h-10 w-10 text-pink-400" />
    } else if (data.followers > 500 && data.score > 80) {
        persona = "The Influencer"
        personaDesc = "People listen when you speak."
        personaIcon = <Sparkles className="h-10 w-10 text-yellow-400" />
    } else if (data.totalLikes > 100) {
        persona = "The Connector"
        personaDesc = "Spreading good vibes everywhere."
        personaIcon = <Heart className="h-10 w-10 text-red-400" />
    } else if (data.castsCount > 10) {
        persona = "The Explorer"
        personaDesc = "Finding your footing in the new world."
        personaIcon = <Compass className="h-10 w-10 text-blue-400" />
    }

    const steps = [
        {
            title: "Your 2025 Reback",
            description: `Welcome back, ${data.displayName}! Let's take a look at your year on Farcaster.`,
            icon: <Calendar className="h-12 w-12 text-purple-400" />,
            color: "from-purple-500/20 to-indigo-500/20",
            accent: "border-purple-500/50"
        },
        {
            title: "Reputation & Rank",
            description: "You've been building your trust score steadily.",
            content: (
                <div className="flex flex-col items-center gap-4 mt-2">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        {data.score}
                    </div>
                    <div className="text-xl font-medium text-cyan-200">Neynar Score</div>
                    <div className="px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                        {data.rank}
                    </div>
                </div>
            ),
            icon: <Trophy className="h-10 w-10 text-yellow-400" />,
            color: "from-cyan-500/20 to-blue-500/20",
            accent: "border-cyan-500/50"
        },
        {
            title: "Your 2025 Vibe",
            description: "Here's the energy you brought to the feed.",
            content: (
                <div className="flex flex-col items-center gap-4 mt-2 w-full">
                    <div className="p-4 rounded-full bg-white/10 border border-white/20 shadow-xl animate-pulse-glow">
                        {personaIcon}
                    </div>
                    <div className="text-3xl font-bold text-white tracking-wide">{persona}</div>
                    <p className="text-sm text-center text-white/70 italic">"{personaDesc}"</p>

                    <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                            <span className="block text-xl font-bold text-green-400">{data.castsCount}</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest">Casts</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                            <span className="block text-xl font-bold text-purple-400">{data.activeDays}</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest">Active Days</span>
                        </div>
                    </div>
                </div>
            ),
            icon: <Zap className="h-10 w-10 text-green-400" />,
            color: "from-green-500/20 to-emerald-500/20",
            accent: "border-green-500/50"
        },
        {
            title: "Community Impact",
            description: "Your voice resonated across the network.",
            content: (
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    <div className="flex flex-col items-center p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <Users className="h-6 w-6 text-pink-400 mb-2" />
                        <span className="text-2xl font-bold text-white">{data.followers}</span>
                        <span className="text-xs text-pink-200/70">Total Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <Heart className="h-6 w-6 text-orange-400 mb-2" />
                        <span className="text-2xl font-bold text-white">{data.totalLikes}</span>
                        <span className="text-xs text-orange-200/70">Recent Likes</span>
                    </div>
                </div>
            ),
            icon: <Heart className="h-10 w-10 text-pink-400" />,
            color: "from-pink-500/20 to-rose-500/20",
            accent: "border-pink-500/50"
        },
        {
            title: "Ready for 2026?",
            description: "Keep building your reputation and connecting with the community!",
            content: (
                <div className="flex flex-col items-center gap-4 mt-2">
                    <button
                        onClick={onShare}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                        <Share2 className="h-5 w-5" />
                        Share Reback
                    </button>
                </div>
            ),
            icon: <Star className="h-12 w-12 text-yellow-300" />,
            color: "from-yellow-500/20 to-orange-500/20",
            accent: "border-yellow-500/50"
        }
    ]

    // Insert Top Cast slide if data exists
    if (data.topCast) {
        steps.splice(3, 0, {
            title: "Top Highlight",
            description: "Your most impactful cast of the period:",
            content: (
                <div className="w-full mt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                    <p className="text-sm text-white/90 italic mb-3">"{data.topCast.text.length > 80 ? data.topCast.text.substring(0, 80) + "..." : data.topCast.text}"</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {data.topCast.likes}</span>
                    </div>
                </div>
            ),
            icon: <Star className="h-10 w-10 text-purple-400" />,
            color: "from-purple-500/20 to-fuchsia-500/20",
            accent: "border-purple-500/50"
        })
    }

    const currentSlide = steps[currentStep]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onClose()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full max-w-md glass-card-strong overflow-hidden border-2 ${currentSlide.accent} transition-colors duration-500 min-h-[500px] flex flex-col`}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.color} opacity-40`} />

                    {/* Progress Bar Top */}
                    <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= currentStep ? "bg-white" : "bg-white/20"}`}
                            />
                        ))}
                    </div>

                    <div className="relative p-8 flex flex-col items-center text-center flex-1 z-10">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors mt-2"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Icon/Image Area */}
                        <div className="mt-8 mb-6 h-32 flex items-center justify-center">
                            <motion.div
                                key={`icon-${currentStep}`}
                                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="p-6 rounded-full bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md"
                            >
                                {currentSlide.icon}
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <motion.div
                            key={`text-${currentStep}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-2 mb-6"
                        >
                            <h2 className="text-3xl font-bold text-white letter-space-wide drop-shadow-lg">
                                {currentSlide.title}
                            </h2>
                            <p className="text-white/80 leading-relaxed max-w-xs mx-auto">
                                {currentSlide.description}
                            </p>
                        </motion.div>

                        {/* Custom Content Slot */}
                        <motion.div
                            key={`content-${currentStep}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full"
                        >
                            {(currentSlide as any).content}
                        </motion.div>

                        <div className="flex-1" />

                        {/* Navigation Buttons */}
                        <div className="flex w-full gap-4 mt-8">
                            {currentStep > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 px-6 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                            >
                                {currentStep === steps.length - 1 ? "Close" : "Next"}
                                {currentStep < steps.length - 1 && <ChevronRight className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
