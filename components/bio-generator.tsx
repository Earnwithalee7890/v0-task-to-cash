"use client"

import { useState } from "react"
import { Wand2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BioGeneratorProps {
    score: number
    followers: number
}

export function BioGenerator({ score, followers }: BioGeneratorProps) {
    const [generatedBio, setGeneratedBio] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    const generateBio = () => {
        setLoading(true)

        // Mock AI generation with templates logic
        const templates = [
            `Neynar Score: ${score} 🚀 | Building on Farcaster`,
            `Crypto Native. Score: ${score}. Followed by ${followers} legends.`,
            `Objective: Top 100. TrueScore verified: ${score}.`,
            `Just here for the vibes and the ${score} score.`,
            `Farcaster OG in training? Score: ${score}`,
            `Certified degen with a ${score} credit score.`,
            `Building reputation onchain. ${score} points strong.`,
        ]

        setTimeout(() => {
            const randomBio = templates[Math.floor(Math.random() * templates.length)]
            setGeneratedBio(randomBio)
            setLoading(false)
            setCopied(false)
        }, 800)
    }

    const copyBio = () => {
        if (generatedBio) {
            navigator.clipboard.writeText(generatedBio)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
                <Wand2 className="h-4 w-4 text-purple-400" />
                <h3 className="font-bold text-sm text-foreground">AI Bio Generator</h3>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
                Need a new bio? Generate one based on your stats!
            </p>

            {!generatedBio ? (
                <Button
                    onClick={generateBio}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-opacity"
                >
                    {loading ? "Generating..." : "Generate Bio"}
                </Button>
            ) : (
                <div className="space-y-3 animate-fade-in">
                    <div className="p-3 bg-black/30 rounded-lg border border-white/10 text-sm text-white/90 italic font-mono">
                        "{generatedBio}"
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={copyBio}
                            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10"
                            variant="secondary"
                        >
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                            onClick={generateBio}
                            disabled={loading}
                            variant="ghost"
                            className="px-3"
                        >
                            <Wand2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
