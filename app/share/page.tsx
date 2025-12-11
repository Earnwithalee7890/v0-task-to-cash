import { Metadata, ResolvingMetadata } from 'next'
import ShareClient from './share-client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const fid = searchParams.fid || '338060' // Fallback to owner if missing

    const appUrl = "https://v0-task-to-cash-seven.vercel.app"
    const imageUrl = `${appUrl}/api/og?fid=${fid}`

    const fcMetadata: Record<string, string> = {
        "fc:frame": JSON.stringify({
            version: "next",
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
        }),
        "fc:miniapp": JSON.stringify({
            version: "next",
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
        })
    }

    return {
        title: `TrueScore - Check User ${fid}'s Score`,
        openGraph: {
            title: "TrueScore",
            description: "Check your real Neynar score instantly",
            images: [imageUrl],
        },
        other: {
            ...fcMetadata
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
