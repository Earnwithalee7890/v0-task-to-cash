"use client"

import { Home, User } from "lucide-react"

interface NavigationProps {
    activeTab: "home" | "profile"
    onTabChange: (tab: "home" | "profile") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 nav-floating z-50">
            <div className="max-w-md mx-auto flex items-center justify-around h-16 px-8">
                <button
                    onClick={() => onTabChange("home")}
                    className="flex flex-col items-center gap-1 px-6 py-2 transition-all duration-300"
                >
                    <Home className={`h-6 w-6 ${activeTab === "home" ? "icon-glow-active" : "icon-glow-inactive"}`} />
                    <span className={`text-xs font-medium ${activeTab === "home" ? "text-cyan-300" : "text-cyan-200/50"}`}>
                        Home
                    </span>
                </button>

                <button
                    onClick={() => onTabChange("profile")}
                    className="flex flex-col items-center gap-1 px-6 py-2 transition-all duration-300"
                >
                    <User className={`h-6 w-6 ${activeTab === "profile" ? "icon-glow-active" : "icon-glow-inactive"}`} />
                    <span className={`text-xs font-medium ${activeTab === "profile" ? "text-cyan-300" : "text-cyan-200/50"}`}>
                        Profile
                    </span>
                </button>
            </div>
        </div>
    )
}
