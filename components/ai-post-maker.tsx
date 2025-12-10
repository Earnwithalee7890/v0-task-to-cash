"use client"

import { useState } from "react"
import { Sparkles, Copy, Check, Loader2 } from "lucide-react"

export function AIPostMaker() {
    const [prompt, setPrompt] = useState("")
    const [generatedPost, setGeneratedPost] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const generatePost = async () => {
        if (!prompt.trim()) return

        setLoading(true)
        try {
            // Simple AI-like post generation using templates
            const templates = [
                `🚀 ${prompt}\n\nExcited to share this with the Farcaster community! 🎯`,
                `💡 Thinking about: ${prompt}\n\nWhat do you all think? Drop your thoughts below! 👇`,
                `🔥 ${prompt}\n\nLFG! Who else is bullish on this? 🚀`,
                `✨ ${prompt}\n\nThis is going to be huge! Can't wait to see what happens next 🌟`,
                `🎯 ${prompt}\n\nSharing this gem with my frens! 💎`,
            ]

            // Randomly select a template
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            setGeneratedPost(randomTemplate)
        } catch (error) {
            console.error("Error generating post:", error)
        } finally {
            setLoading(false)
        }
    }

    const copyPost = async () => {
        if (!generatedPost) return
        await navigator.clipboard.writeText(generatedPost)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="glass-card-strong p-6 rounded-2xl space-y-4 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-2 border-purple-400/30 box-glow-aqua">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">AI Post Maker</h3>
                    <p className="text-xs text-purple-200">Generate engaging Farcaster posts ✨</p>
                </div>
            </div>

            {/* Input Area */}
            <div className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your post idea... (e.g., 'Excited about the new TrueScore features!')"
                    className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/50 border-2 border-purple-400/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    maxLength={200}
                />

                <button
                    onClick={generatePost}
                    disabled={!prompt.trim() || loading}
                    className="w-full glass-neon-button glossy-overlay flex items-center justify-center gap-2 h-12 rounded-2xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            Generate Post
                        </>
                    )}
                </button>
            </div>

            {/* Generated Post Display */}
            {generatedPost && (
                <div className="space-y-3 animate-slide-up">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{generatedPost}</p>
                    </div>

                    <button
                        onClick={copyPost}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all hover:scale-105 active:scale-95"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="font-semibold text-sm text-green-500">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                <span className="font-semibold text-sm">Copy Post</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
