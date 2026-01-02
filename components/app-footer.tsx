"use client"
import { useState } from "react"
import { AboutModal } from "./about-modal"
import { TOSModal } from "./tos-modal"

export function AppFooter() {
  const [showAbout, setShowAbout] = useState(false)
  const [showTOS, setShowTOS] = useState(false)

  return (
    <>
      <footer className="py-6 text-center space-y-4">
        <div className="flex gap-4 text-xs text-muted-foreground/60 justify-center">
          <button onClick={() => setShowAbout(true)} className="hover:text-cyan-400 transition-colors">Privacy</button>
          <button onClick={() => setShowTOS(true)} className="hover:text-cyan-400 transition-colors">Terms</button>
          <a
            href="mailto:support@truescore.xyz?subject=TrueScore%20Feedback"
            className="hover:text-cyan-400 transition-colors"
          >
            Feedback
          </a>
        </div>
        <p className="text-[10px] text-muted-foreground/40 font-light flex items-center justify-center gap-2">
          <span>Built with Neynar & Farcaster Frames</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>v0.1.0</span>
        </p>
      </footer>
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <TOSModal isOpen={showTOS} onClose={() => setShowTOS(false)} />
    </>
  )
}
