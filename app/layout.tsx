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
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "farcaster:manifest": `${appUrl}/.well-known/farcaster.json`,
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/api/og?fid=338060`,
      button: {
        title: "Check Neynar Score",
        action: {
          type: "launch_miniapp",
          name: "TrueScore",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#1a1a2e"
        }
      }
    }),
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/api/og?fid=338060`,
      button: {
        title: "Check Neynar Score",
        action: {
          type: "launch_frame",
          name: "TrueScore",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#1a1a2e"
        }
      }
    })
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
      <body className={`font-sans antialiased ${_inter.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
