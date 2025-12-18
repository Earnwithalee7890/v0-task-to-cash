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
    const score = searchParams.score ? String(searchParams.score) : "0"
    const rep = searchParams.rep ? String(searchParams.rep) : "unknown"
    const username = searchParams.username ? String(searchParams.username) : "user"
    const builder = searchParams.builder ? String(searchParams.builder) : "0"
    const creator = searchParams.creator ? String(searchParams.creator) : "0"
    const ts = searchParams._ ? String(searchParams._) : Date.now().toString()

    // Pass all params to OG image to ensure instant rendering with correct data
    const appUrl = "https://v0-task-to-cash-seven.vercel.app"
    const imageUrl = `${appUrl}/api/og?fid=${fid}&score=${score}&rep=${rep}&username=${username}&builder=${builder}&creator=${creator}&_=${ts}`

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
