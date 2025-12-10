import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const appUrl = "https://v0-task-to-cash-seven.vercel.app"

export const metadata: Metadata = {
  title: "TrueScore - Your Real Neynar Reputation",
  description: "View your real Neynar score, engagement analytics, and account reputation on Farcaster",
  generator: "v0.app",
  openGraph: {
    title: "TrueScore",
    description: "Your Real Neynar Reputation Score",
    images: [`${appUrl}/api/og?fid=338060`],
  },
  other: {
    "farcaster:manifest": `${appUrl}/.well-known/farcaster.json`,
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/.well-known/farcaster.json" />

        {/* Farcaster Mini App Embed */}
        <meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://v0-task-to-cash-seven.vercel.app/api/og?fid=338060","button":{"title":"Check Neynar Score","action":{"type":"launch_miniapp","name":"TrueScore","url":"https://v0-task-to-cash-seven.vercel.app","splashImageUrl":"https://v0-task-to-cash-seven.vercel.app/splash.png","splashBackgroundColor":"#1a1a2e"}}}' />
        {/* For backward compatibility */}
        <meta name="fc:frame" content='{"version":"1","imageUrl":"https://v0-task-to-cash-seven.vercel.app/api/og?fid=338060","button":{"title":"Check Neynar Score","action":{"type":"launch_frame","name":"TrueScore","url":"https://v0-task-to-cash-seven.vercel.app","splashImageUrl":"https://v0-task-to-cash-seven.vercel.app/splash.png","splashBackgroundColor":"#1a1a2e"}}}' />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="TrueScore - Your Real Neynar Reputation" />
        <meta property="og:description" content="Check your real Neynar score instantly" />
        <meta property="og:image" content="https://v0-task-to-cash-seven.vercel.app/api/og?fid=338060" />
        <meta property="twitter:card" content="summary_large_image" />
      </head>
      <body className={`font-sans antialiased ${_inter.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
