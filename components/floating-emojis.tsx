"use client"

interface FloatingEmojisProps {
    theme?: "light" | "dark"
}

export function FloatingEmojis({ theme = "dark" }: FloatingEmojisProps) {
    const emojis = ["🎯", "⭐", "🔥", "💎", "🏆", "✨", "🚀", "💫", "⚡", "🎪", "🌟", "💪", "👑", "🎨", "🎭"]

    // Generate random emojis with random positions and delays
    const floatingEmojis = Array.from({ length: 20 }, (_, i) => ({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        duration: `${15 + Math.random() * 15}s`, // 15-30s duration
        size: `${1.5 + Math.random() * 2}rem`, // 1.5-3.5rem
    }))

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {floatingEmojis.map((item, index) => (
                <div
                    key={index}
                    className="absolute opacity-20 animate-float-up"
                    style={{
                        left: item.left,
                        bottom: '-10%',
                        fontSize: item.size,
                        animationDelay: item.animationDelay,
                        animationDuration: item.duration,
                    }}
                >
                    {item.emoji}
                </div>
            ))}
        </div>
    )
}
