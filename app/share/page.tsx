import { Metadata } from "next"
import { getUserScore } from "@/lib/neynar"

interface SharePageProps {
    searchParams: Promise<{
        fid?: string
    }>
}

const appUrl = "https://v0-task-to-cash-seven.vercel.app"

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
    const params = await searchParams
    const fid = params.fid ? Number(params.fid) : 338060

    // Fetch live user data from Neynar
    const userData = await getUserScore(fid)

    // Build dynamic OG image URL - only needs FID now
    const ogImageUrl = `${appUrl}/api/og?fid=${fid}`

    // Build embed JSON for Farcaster
    const embedJson = JSON.stringify({
        version: "1",
        imageUrl: ogImageUrl,
        button: {
            title: "Check My Score",
            action: {
                type: "launch_miniapp",
                name: "TrueScore",
                url: appUrl,
                splashImageUrl: `${appUrl}/splash.png`,
                splashBackgroundColor: "#1a1a2e"
            }
        }
    })

    return {
        title: `${userData.displayName}'s TrueScore - ${userData.score} Points`,
        description: `${userData.displayName} (@${userData.username}) has a Neynar score of ${userData.score}. Check your own TrueScore!`,
        openGraph: {
            title: `${userData.displayName}'s TrueScore`,
            description: `Neynar Score: ${userData.score} | Reputation: ${userData.reputation}`,
            images: [ogImageUrl],
        },
        twitter: {
            card: "summary_large_image",
            title: `${userData.displayName}'s TrueScore`,
            description: `Neynar Score: ${userData.score} | Reputation: ${userData.reputation}`,
            images: [ogImageUrl],
        },
        other: {
            "fc:frame": embedJson,
            "fc:miniapp": embedJson,
        },
    }
}

export default async function SharePage({ searchParams }: SharePageProps) {
    const params = await searchParams
    const fid = params.fid ? Number(params.fid) : 338060

    // Fetch live data for display
    const userData = await getUserScore(fid)

    // Return a simple page that redirects - crawlers will read meta tags first
    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.location.href = '/';`
                }}
            />
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                }}
            >
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        {userData.displayName}&apos;s TrueScore: {userData.score}
                    </h1>
                    <p className="opacity-70">Loading TrueScore app...</p>
                </div>
            </div>
        </>
    )
}
