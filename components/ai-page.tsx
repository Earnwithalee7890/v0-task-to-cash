"use client"

import { useState } from "react"
import { AIPostMaker } from "./ai-post-maker"
import { AIAnalysisSection } from "./ai-analysis-section"
import { AIInsightsModal } from "./ai-insights-modal"
import type { UserData } from "./truescore-app"

interface AIPageProps {
    userData: UserData
}

export function AIPage({ userData }: AIPageProps) {
    const [showAIInsights, setShowAIInsights] = useState(false)

    const handleAIInsights = () => {
        setShowAIInsights(true)
    }

    return (
        <>
            {/* AI Insights Modal */}
            {showAIInsights && (
                <AIInsightsModal
                    userData={userData}
                    onClose={() => setShowAIInsights(false)}
                />
            )}

            <div className="space-y-6 pb-2">
                {/* AI Post Maker */}
                <div className="opacity-0 animate-slide-up stagger-1">
                    <AIPostMaker />
                </div>

                {/* AI Analysis Section */}
                <div className="opacity-0 animate-slide-up stagger-2">
                    <AIAnalysisSection onGetInsights={handleAIInsights} />
                </div>
            </div>
        </>
    )
}
