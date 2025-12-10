"use client"

import { Sparkles } from "lucide-react"

interface AIAnalysisSectionProps {
    onGetInsights?: () => void
}

export function AIAnalysisSection({ onGetInsights }: AIAnalysisSectionProps) {
    return (
        <div className="glass-card-strong p-6 rounded-2xl border-2 border-purple-500/20 neon-glow-purple">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground text-shadow-sm">AI TrueScore Analysis</h3>
                    <p className="text-xs text-muted-foreground">Powered by AI insights</p>
                </div>
            </div>

            <button
                onClick={onGetInsights}
                className="w-full py-3 rounded-xl btn-gradient-purple text-white font-semibold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Sparkles className="w-5 h-5" />
                Get AI Insights
            </button>
        </div>
    )
}
