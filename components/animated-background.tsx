"use client"

import { ReactNode } from "react"

interface AnimatedBackgroundProps {
    children: ReactNode
    theme?: "light" | "dark"
}

export function AnimatedBackground({ children, theme = "dark" }: AnimatedBackgroundProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-900">
            {/* Content layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
