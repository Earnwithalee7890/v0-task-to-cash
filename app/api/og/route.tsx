import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const fid = Number(searchParams.get('fid')) || 0

        let score = 0
        let username = 'user'
        let reputation = 'Unknown'

        // Fetch user data if FID is provided
        if (fid > 0) {
            try {
                const apiKey = process.env.NEYNAR_API_KEY
                const res = await fetch(
                    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
                    {
                        headers: {
                            accept: 'application/json',
                            'x-api-key': apiKey || '',
                        },
                    }
                )

                if (res.ok) {
                    const json = await res.json()
                    const user = json.users?.[0]

                    if (user) {
                        const rawScore = user.experimental?.neynar_user_score ?? 0
                        score = Math.round(rawScore * 100)
                        username = user.username || 'user'

                        // Calculate reputation based on score
                        if (score >= 80) reputation = 'SAFE'
                        else if (score >= 50) reputation = 'NEUTRAL'
                        else if (score >= 25) reputation = 'RISKY'
                        else reputation = 'SPAMMY'
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        color: '#fff',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ fontSize: 160, fontWeight: 'bold' }}>{score}</div>
                    <div style={{ fontSize: 45, opacity: 0.8, marginTop: 10 }}>
                        @{username}
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            marginTop: 20,
                            padding: '10px 30px',
                            border: '1px solid #333',
                            borderRadius: 20,
                        }}
                    >
                        {reputation}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (error) {
        console.error('OG Route Error:', error)

        // Return a basic error image instead of crashing
        return new Response('Error generating image', { status: 500 })
    }
}
