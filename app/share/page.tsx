import { Metadata } from "next"

interface SharePageProps {
    searchParams: Promise<{
        fid?: string
        score?: string
        username?: string
        displayName?: string
        reputation?: string
    }>
}

const appUrl = "https://v0-task-to-cash-seven.vercel.app"

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
    const params = await searchParams
    const score = params.score || "0"
    const username = params.username || "User"
    const displayName = params.displayName || username
    const reputation = params.reputation || "neutral"

    // Build dynamic OG image URL
    const ogImageUrl = `${appUrl}/api/og?score=${encodeURIComponent(score)}&username=${encodeURIComponent(username)}&displayName=${encodeURIComponent(displayName)}&reputation=${encodeURIComponent(reputation)}`

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
        title: `${displayName}'s TrueScore - ${score} Points`,
        description: `${displayName} (@${username}) has a Neynar score of ${score}. Check your own TrueScore!`,
        openGraph: {
            title: `${displayName}'s TrueScore`,
            description: `Neynar Score: ${score} | Reputation: ${reputation}`,
            images: [ogImageUrl],
        },
        twitter: {
            card: "summary_large_image",
            title: `${displayName}'s TrueScore`,
            description: `Neynar Score: ${score} | Reputation: ${reputation}`,
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
    const score = params.score || "0"
    const displayName = params.displayName || params.username || "User"

    // Render a page with meta tags - crawlers will see this
    // Users will be redirected via meta refresh
    return (
        <html>
            <head>
                <meta httpEquiv="refresh" content="0;url=/" />
            </head>
            <body style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontFamily: "system-ui, sans-serif"
            }}>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                        {displayName}&apos;s TrueScore: {score}
                    </h1>
                    <p style={{ opacity: 0.7 }}>Loading TrueScore app...</p>
                </div>
            </body>
        </html>
    )
}
