import { TrueScoreApp } from "@/components/truescore-app"
import { Metadata } from "next"

const appUrl = "https://v0-task-to-cash-seven.vercel.app"


type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const fid = searchParams.fid ? String(searchParams.fid) : "338060"
  const imageUrl = `${appUrl}/api/og?fid=${fid}`

  return {
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        imageUrl: imageUrl,
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
        imageUrl: imageUrl,
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
}

export default function Home() {
  return <TrueScoreApp />
}
