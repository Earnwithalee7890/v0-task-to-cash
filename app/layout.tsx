import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"

// ... imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${_inter.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}
