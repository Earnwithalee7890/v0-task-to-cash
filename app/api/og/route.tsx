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

        const type = searchParams.get('type');

        if (type === 'powercard') {
            return new ImageResponse(
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Slate gradient
                        padding: '40px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.8)',
                        borderRadius: '30px',
                        padding: '40px',
                        border: '4px solid #FACC15', // Yellow border (legendary-ish)
                        boxShadow: '0 0 50px rgba(250, 204, 21, 0.3)',
                        width: '500px',
                        height: '700px',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginBottom: '20px',
                            color: '#FACC15',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            <span>{score > 90 ? 'Legendary' : score > 75 ? 'Epic' : 'Rare'}</span>
                            <span>⚡ {score}</span>
                        </div>

                        <img
                            src={pfpUrl || 'https://v0-task-to-cash-seven.vercel.app/placeholder-user.jpg'}
                            width="300"
                            height="300"
                            style={{
                                borderRadius: '20px',
                                border: '4px solid #FACC15',
                                objectFit: 'cover',
                                marginBottom: '30px'
                            }}
                        />

                        <div style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '40px',
                            textAlign: 'center'
                        }}>
                            {displayName}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center', width: '45%' }}>
                                <div style={{ color: '#94A3B8', fontSize: '18px' }}>FID</div>
                                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{user?.fid || fid}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center', width: '45%' }}>
                                <div style={{ color: '#94A3B8', fontSize: '18px' }}>STATUS</div>
                                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textTransform: 'capitalize' }}>{user?.active_status || 'Active'}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', color: '#22D3EE', fontSize: '20px', fontWeight: 'bold' }}>
                            TRUESCORE CARD
                        </div>
                    </div>
                </div>,
                {
                    width: 800,
                    height: 1000, // Vertical aspect ratio for card
                }
            );
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
