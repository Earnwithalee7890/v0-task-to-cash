import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fid = searchParams.get('fid') || '338060';

        // Fetch user data from Neynar
        let username = 'user';
        let displayName = 'TrueScore User';
        let score = 0;
        let reputation = 'Unknown';
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
                    score = Math.round(rawScore * 100);
                    username = user.username || 'user';
                    displayName = user.display_name || username;
                    pfpUrl = user.pfp_url || '';

                    // Calculate reputation
                    if (score >= 80) reputation = 'SAFE';
                    else if (score >= 50) reputation = 'NEUTRAL';
                    else if (score >= 25) reputation = 'RISKY';
                    else reputation = 'SPAMMY';
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        // Reputation color mapping
        const reputationColors = {
            SAFE: { bg: 'rgb(34, 197, 94)', text: 'rgb(240, 253, 244)' },    // green
            NEUTRAL: { bg: 'rgb(234, 179, 8)', text: 'rgb(254, 252, 232)' }, // yellow
            RISKY: { bg: 'rgb(249, 115, 22)', text: 'rgb(255, 247, 237)' },  // orange
            SPAMMY: { bg: 'rgb(239, 68, 68)', text: 'rgb(254, 242, 242)' },  // red
        };

        const repColor = reputationColors[reputation as keyof typeof reputationColors] || reputationColors.NEUTRAL;

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
                        background: 'linear-gradient(135deg, #0a0e27 0%, #0f1429 50%, #1a2040 100%)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        position: 'relative',
                    }}
                >
                    {/* Glow effects */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.2) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '10%',
                            width: '350px',
                            height: '350px',
                            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Main card */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '60px',
                            borderRadius: '32px',
                            background: 'rgba(15, 20, 41, 0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(0, 217, 255, 0.3)',
                            boxShadow: '0 0 40px rgba(0, 217, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)',
                            width: '900px',
                        }}
                    >
                        {/* Logo/Title */}
                        <div
                            style={{
                                fontSize: '48px',
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #00d9ff 0%, #00ffcc 100%)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                letterSpacing: '0.15em',
                                marginBottom: '40px',
                                textShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
                            }}
                        >
                            TRUESCORE
                        </div>

                        {/* User info */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '30px',
                                marginBottom: '50px',
                            }}
                        >
                            {/* Avatar - Use initials instead of external image for reliability */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '128px',
                                    height: '128px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #00d9ff 0%, #00ffcc 100%)',
                                    border: '4px solid rgba(0, 217, 255, 0.6)',
                                    boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
                                    fontSize: '48px',
                                    fontWeight: 900,
                                    color: '#0a0e27',
                                }}
                            >
                                {displayName.substring(0, 2).toUpperCase()}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    style={{
                                        fontSize: '36px',
                                        fontWeight: 700,
                                        color: '#e0f4ff',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {displayName}
                                </div>
                                <div
                                    style={{
                                        fontSize: '24px',
                                        color: '#7fa8c7',
                                    }}
                                >
                                    @{username}
                                </div>
                            </div>
                        </div>

                        {/* Score display */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '40px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '24px',
                                    color: '#7fa8c7',
                                    marginBottom: '16px',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Neynar Score
                            </div>
                            <div
                                style={{
                                    fontSize: '120px',
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, #00d9ff 0%, #00ffcc 100%)',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    lineHeight: 1,
                                    textShadow: '0 0 40px rgba(0, 217, 255, 0.6)',
                                }}
                            >
                                {score}
                            </div>
                        </div>

                        {/* Reputation badge */}
                        <div
                            style={{
                                display: 'flex',
                                padding: '16px 40px',
                                borderRadius: '999px',
                                background: repColor.bg,
                                fontSize: '28px',
                                fontWeight: 700,
                                color: repColor.text,
                                letterSpacing: '0.1em',
                                boxShadow: `0 0 20px ${repColor.bg}40`,
                            }}
                        >
                            {reputation}
                        </div>
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            marginTop: '40px',
                            fontSize: '20px',
                            color: '#7fa8c7',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Your Farcaster Reputation Score
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error('OG Image generation error:', error);

        // Fallback error image
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
                        background: 'linear-gradient(135deg, #0a0e27 0%, #1a2040 100%)',
                        color: '#e0f4ff',
                        fontSize: '40px',
                        fontWeight: 700,
                    }}
                >
                    <div>TrueScore</div>
                    <div style={{ fontSize: '24px', marginTop: '20px', color: '#7fa8c7' }}>
                        Your Farcaster Reputation
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    }
}
