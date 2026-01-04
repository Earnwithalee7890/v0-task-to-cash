"use client"

import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <AnimatedBackground theme="dark">
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-8 relative z-10 max-w-md w-full">
                    {/* Glitch Effect Title */}
                    <div className="relative inline-block">
                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 animate-pulse">
                            404
                        </h1>
                        <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-30 bg-gradient-to-r from-transparent via-white to-transparent" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-yellow-400" />
                            System Malfunction
                        </h2>
                        <p className="text-muted-foreground">
                            The requested reputation data could not be located in the neural network.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:scale-105 transition-all duration-300 font-semibold"
                        >
                            <Home className="h-4 w-4" />
                            Return to Base
                        </Link>
                    </div>
                </div>
            </main>
        </AnimatedBackground>
    )
}
