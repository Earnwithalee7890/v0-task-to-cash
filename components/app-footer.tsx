"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"

export function AppFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-border/30">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <Image src="/trustscore-logo.png" alt="TrustScore Logo" width={140} height={48} className="h-12 w-auto" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Your trusted source for real Farcaster reputation data. View authentic Neynar scores, follower stats, and
          account reputation labels.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a
            href="https://neynar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            Powered by Neynar
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-border">|</span>
          <a
            href="https://farcaster.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            Farcaster
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">Built for the Farcaster community</p>
      </div>
    </footer>
  )
}
