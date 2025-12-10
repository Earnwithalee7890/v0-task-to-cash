"use client"

import { ReactNode } from "react"

interface NeonButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    variant?: "primary" | "secondary"
}

export function NeonButton({ children, onClick, className = "", variant = "primary" }: NeonButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        glass-neon-button glossy-overlay
        px-6 py-3 rounded-2xl
        font-semibold text-white
        hover:scale-105 active:scale-95
        transition-all duration-300
        ${className}
      `}
        >
            {children}
        </button>
    )
}
