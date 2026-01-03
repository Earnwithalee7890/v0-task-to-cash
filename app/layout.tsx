import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const appUrl = "https://v0-task-to-cash-seven.vercel.app"

export const metadata: Metadata = {
  title: "TrueScore - Your Real Neynar Reputation",
  description: "View your real Neynar score, engagement analytics, and account reputation on Farcaster",
  keywords: ["Farcaster", "Neynar", "Reputation", "Crypto", "Base", "Social Identity", "Year Reback"],
  generator: "v0.app",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TrueScore",
    description: "Your Real Neynar Reputation Score",
    images: [`${appUrl}/og-image.png`],
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
      <body className={`font-sans antialiased ${inter.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}
