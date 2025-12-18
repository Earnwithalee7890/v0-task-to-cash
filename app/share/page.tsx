import { Metadata, ResolvingMetadata } from "next"
import ShareClient from "./share-client"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props
): Promise<Metadata> {
    const searchParams = await props.searchParams
    const fid = searchParams.fid ? String(searchParams.fid) : "338060"
    const ts = searchParams._ ? String(searchParams._) : Date.now().toString()

    // Pass FID and timestamp to OG image to ensure fresh rendering and bypass cache
    const appUrl = "https://v0-task-to-cash-seven.vercel.app"
    const imageUrl = `${appUrl}/api/og?fid=${fid}&_=${ts}`

    return {
        title: "TrueScore",
        openGraph: {
            title: "TrueScore",
            description: "Check your Neynar reputation instantly",
            images: [imageUrl]
        },
        other: {
            "fc:frame": JSON.stringify({
                version: "1",
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
                version: "1",
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
