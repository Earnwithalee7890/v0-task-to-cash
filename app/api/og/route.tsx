import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
// Full-screen vibrant OG image with user photo and decimal score

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fid = searchParams.get('fid') || '338060';

        // Fetch user data from Neynar
        let username = 'user';
        let displayName = 'User';
        let score = 0;
        let pfpUrl = '';

        try {
            const response = await fetch(
                `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
                {
                    headers: {
                        'accept': 'application/json',
                        'x-api-key': process.env.NEYNAR_API_KEY || '',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const user = data.users?.[0];

                if (user) {
                    const rawScore = user.experimental?.neynar_user_score || 0;
                    score = rawScore; // Keep as decimal
                    username = user.username || 'user';
                    displayName = user.display_name || username;
                    pfpUrl = user.pfp_url || '';
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        return new ImageResponse(
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #312e81 100%)',
                    padding: '0',
                    margin: '0',
                }}
            >
                {/* Profile Photo Circle */}
                {pfpUrl ? (
                    <img
                        src={pfpUrl}
                        alt="avatar"
                        width="200"
                        height="200"
                        style={{
                            borderRadius: '50%',
                            border: '8px solid rgba(255, 255, 255, 0.9)',
                            marginBottom: '40px',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '8px solid rgba(255, 255, 255, 0.9)',
                            fontSize: '80px',
                            fontWeight: 900,
                            color: '#4ECDC4',
                            marginBottom: '40px',
                        }}
                    >
                        {displayName.substring(0, 2).toUpperCase()}
                    </div>
                )}

                {/* Username and Title */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: '48px',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '20px',
                        textAlign: 'center',
                    }}
                >
                    {displayName} 🟦's Neynar Score
                </div>

                {/* Score */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: '120px',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '30px',
                    }}
                >
                    {score.toFixed(2)}
                </div>

                {/* Label */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: '32px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    Neynar Score
                </div>
            </div>,
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error('OG Image error:', error);

        // Simple fallback
        return new ImageResponse(
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: 700,
                }}
            >
                TrueScore
            </div>,
            {
                width: 1200,
                height: 630,
            }
        );
    }
}
