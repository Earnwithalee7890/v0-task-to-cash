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
    images: [`${appUrl}/og-image.png`],
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

        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${appUrl}/og-image.png`} />
        <meta property="fc:frame:button:1" content="Open App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content={appUrl} />
        <meta property="og:image" content={`${appUrl}/og-image.png`} />
        <meta property="og:title" content="TrueScore - Your Real Neynar Reputation" />
        <meta property="og:description" content="View your real Neynar score and Farcaster reputation" />
      </head>
      <body className={`font-sans antialiased ${_inter.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
