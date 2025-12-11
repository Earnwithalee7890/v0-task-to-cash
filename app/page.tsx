import { TrueScoreApp } from "@/components/truescore-app"
import { Metadata } from "next"

const appUrl = "https://v0-task-to-cash-seven.vercel.app"

export const metadata: Metadata = {
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
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
      version: "1",
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
  }
}

export default function Home() {
  return <TrueScoreApp />
}
