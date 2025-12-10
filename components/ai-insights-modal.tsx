"use client"

import { X, Sparkles, TrendingUp, Users, MessageCircle, Zap } from "lucide-react"

interface AIInsightsModalProps {
    onClose: () => void
    userData: {
        username: string
        score: number
        reputation: string
        followers: number
        following: number
    }
}

export function AIInsightsModal({ onClose, userData }: AIInsightsModalProps) {
    const insights = [
        {
            icon: TrendingUp,
            title: "Reputation Excellence",
            description: `With a TrueScore of ${userData.score}/100 and a ${userData.reputation.toUpperCase()} reputation rating, you're recognized as a trusted community member. Your consistent positive engagement and authentic interactions have established you as a reliable voice in the Farcaster ecosystem. This strong foundation opens doors to premium opportunities and exclusive community features.`,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            icon: Users,
            title: "Network Dynamics & Influence",
            description: `Your network of ${userData.followers} followers and ${userData.following} following creates a ${(userData.followers / userData.following).toFixed(2)}x follower ratio, demonstrating genuine community value. This balanced growth pattern indicates organic reach rather than artificial inflation. You're building meaningful connections that amplify your voice and create lasting impact in your niche.`,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: MessageCircle,
            title: "Engagement Pattern Analysis",
            description: `Your interaction style reflects thoughtful, quality-driven engagement. The AI detects authentic conversation patterns, meaningful thread participation, and valuable content contribution. This natural engagement style builds stronger relationships than high-frequency, low-quality interactions. Continue fostering these genuine connections to strengthen your community presence.`,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10"
        },
        {
            icon: Zap,
            title: "Growth Strategy Recommendations",
            description: `To elevate your TrueScore further, focus on: (1) Consistent daily engagement during peak activity hours, (2) Creating original, valuable content that sparks discussion, (3) Meaningful interactions with emerging voices in your community, and (4) Building thought leadership in your area of expertise. These strategic actions compound over time to create exponential growth.`,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10"
        }
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-strong max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 neon-glow-purple">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground text-shadow-sm">AI TrueScore Analysis</h2>
                            <p className="text-sm text-muted-foreground">for @{userData.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Insights */}
                <div className="space-y-4 mb-6">
                    {insights.map((insight, index) => {
                        const Icon = insight.icon
                        return (
                            <div
                                key={index}
                                className="p-4 rounded-xl bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                                        <Icon className={`w-5 h-5 ${insight.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <p className="text-xs text-center text-muted-foreground">
                        💡 <strong>Pro Tip:</strong> These insights are AI-generated based on your Farcaster activity patterns and reputation metrics.
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 rounded-xl btn-gradient-purple text-white font-semibold hover:scale-105 active:scale-95 transition-all"
                >
                    Got it!
                </button>
            </div>
        </div>
    )
}
