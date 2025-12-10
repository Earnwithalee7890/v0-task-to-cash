"use client"

interface NeonStarsBackgroundProps {
    density?: number
}

export function NeonStarsBackground({ density = 100 }: NeonStarsBackgroundProps) {
    // Generate random stars with varying sizes, positions, and animation delays
    const stars = Array.from({ length: density }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1, // 1-4px
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${2 + Math.random() * 4}s`, // 2-6s
        opacity: Math.random() * 0.7 + 0.3, // 0.3-1.0
    }))

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {/* Background radial gradient */}
            <div className="absolute inset-0 neon-space-radial" />

            {/* Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full animate-twinkle"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        top: star.top,
                        left: star.left,
                        backgroundColor: star.size > 2.5 ? '#00d9ff' : '#ffffff',
                        boxShadow: star.size > 2.5
                            ? '0 0 10px rgba(0, 217, 255, 0.8)'
                            : '0 0 3px rgba(255, 255, 255, 0.6)',
                        animationDelay: star.animationDelay,
                        animationDuration: star.animationDuration,
                        opacity: star.opacity,
                    }}
                />
            ))}

            {/* Larger glowing particles */}
            <div
                className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 animate-drift"
                style={{
                    background: 'radial-gradient(circle, #00d9ff 0%, transparent 70%)',
                    top: '20%',
                    left: '15%',
                }}
            />
            <div
                className="absolute w-32 h-32 rounded-full blur-3xl opacity-15 animate-drift"
                style={{
                    background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)',
                    top: '60%',
                    right: '20%',
                    animationDelay: '3s',
                }}
            />
            <div
                className="absolute w-36 h-36 rounded-full blur-3xl opacity-10 animate-drift"
                style={{
                    background: 'radial-gradient(circle, #0088ff 0%, transparent 70%)',
                    bottom: '25%',
                    left: '50%',
                    animationDelay: '6s',
                }}
            />
        </div>
    )
}
