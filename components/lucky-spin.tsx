"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function LuckySpin() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSpinning, setIsSpinning] = useState(false)
    const [reward, setReward] = useState<number | null>(null)
    const [rotation, setRotation] = useState(0)

    const handleSpin = () => {
        if (isSpinning) return

        setIsSpinning(true)
        setReward(null)

        // Random rotation between 720 (2 spins) and 1440 (4 spins) + random segment offset
        const spins = 1080 + Math.random() * 360
        const newRotation = rotation + spins
        setRotation(newRotation)

        setTimeout(() => {
            setIsSpinning(false)
            // Mock reward logic
            const rewards = [10, 50, 100, 500, 1000]
            const won = rewards[Math.floor(Math.random() * rewards.length)]
            setReward(won)
        }, 3000)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full relative overflow-hidden group rounded-xl p-4 border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-900/40 to-purple-900/40 hover:from-fuchsia-800/50 hover:to-purple-800/50 transition-all duration-300 active:scale-95"
                aria-label="Open daily bonus spin"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                            <Gift className="h-5 w-5 text-white animate-bounce-subtle" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-white text-sm">Daily Bonus Spin</h3>
                            <p className="text-xs text-fuchsia-200/70">Win up to 1000 XP</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/30 text-xs font-bold text-fuchsia-300">
                        Free Spin
                    </div>
                </div>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-sm bg-black/90 border-fuchsia-500/50 backdrop-blur-xl text-white">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 uppercase tracking-widest">
                            Wheel of Fortune
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative py-8 flex flex-col items-center justify-center min-h-[300px]">
                        {/* The Wheel */}
                        <div className="relative w-64 h-64 mb-8">
                            {/* Pointer */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8">
                                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-t-yellow-400 border-r-[10px] border-r-transparent drop-shadow-lg" />
                            </div>

                            <motion.div
                                className="w-full h-full rounded-full border-4 border-fuchsia-500/50 shadow-[0_0_50px_rgba(232,121,249,0.3)] relative overflow-hidden bg-black"
                                animate={{ rotate: rotation }}
                                transition={{ duration: 3, ease: "circOut" }}
                            >
                                {/* Wheel Segments (CSS Conic Gradient implies segments) */}
                                <div className="absolute inset-0 rounded-full opacity-80"
                                    style={{
                                        background: `conic-gradient(
                                             #c026d3 0deg 72deg,
                                             #7e22ce 72deg 144deg,
                                             #db2777 144deg 216deg,
                                             #9333ea 216deg 288deg,
                                             #4f46e5 288deg 360deg
                                         )`
                                    }}
                                />
                                {/* Segment Dividers/Lines */}
                                <div className="absolute inset-0">
                                    {[0, 72, 144, 216, 288].map((deg) => (
                                        <div
                                            key={deg}
                                            className="absolute top-0 left-1/2 h-1/2 w-0.5 bg-white/20 origin-bottom"
                                            style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
                                        />
                                    ))}
                                </div>
                                {/* Center Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Result Display */}
                        <AnimatePresence>
                            {reward && !isSpinning && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 rounded-lg backdrop-blur-sm"
                                >
                                    <div className="text-center space-y-2">
                                        <Sparkles className="h-12 w-12 text-yellow-400 mx-auto animate-spin-slow" />
                                        <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                            +{reward} XP
                                        </div>
                                        <Button onClick={() => setIsOpen(false)} variant="outline" className="mt-4 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500/20">
                                            Claim
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            onClick={handleSpin}
                            disabled={isSpinning || reward !== null}
                            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(192,38,211,0.4)]"
                        >
                            {isSpinning ? "Spinning..." : "SPIN NOW"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
