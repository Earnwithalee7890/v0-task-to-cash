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
  robots: {
    index: true,
    follow: true,
  },
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
    "base:app_id": "69459eacd19763ca26ddc592",
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
