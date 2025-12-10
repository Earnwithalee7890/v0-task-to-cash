"use client"

import { ReactNode } from "react"
import { NeonStarsBackground } from "./neon-stars-background"
import { FloatingEmojis } from "./floating-emojis"

interface AnimatedBackgroundProps {
    children: ReactNode
    theme?: "light" | "dark"
}

export function AnimatedBackground({ children, theme = "dark" }: AnimatedBackgroundProps) {
    return (
        <div className="relative min-h-screen overflow-hidden neon-space-bg">
            {/* Neon Star Field Background */}
            <NeonStarsBackground density={120} />

            {/* Flying Emojis Layer */}
            <FloatingEmojis theme={theme} />

            {/* Content layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
