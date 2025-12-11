import { Metadata, ResolvingMetadata } from "next"
import ShareClient from "./share-client"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const fid = searchParams.fid ? String(searchParams.fid) : undefined

    // If no FID, show generic OG image instead of your own FID
    const appUrl = "https://v0-task-to-cash-seven.vercel.app"
    const imageUrl = fid
        ? `${appUrl}/api/og?fid=${fid}`
        : `${appUrl}/default-og.png`

    return {
        title: "TrueScore",
        openGraph: {
            title: "TrueScore",
            description: "Check your Neynar reputation instantly",
            images: [imageUrl]
        },
        other: {
            "fc:frame": JSON.stringify({
                version: "next",
                imageUrl,
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
            }),
            "fc:miniapp": JSON.stringify({
                version: "next",
                imageUrl,
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
            })
        }
    }
}

export default function SharePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShareClient />
        </Suspense>
    )
}
