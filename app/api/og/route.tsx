import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get('fid') || '338060';

    // Fetch user data
    let score = 0;
    let username = 'user';
    let reputation = 'Unknown';

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
          if (score >= 80) reputation = 'SAFE';
          else if (score >= 50) reputation = 'NEUTRAL';
          else if (score >= 25) reputation = 'RISKY';
          else reputation = 'SPAMMY';
        }
      }
    } catch (e) { }

    // Reputation Colors
    let repColor = '#94a3b8';
    if (reputation === 'SAFE') repColor = '#4ade80';
    if (reputation === 'NEUTRAL') repColor = '#38bdf8';
    if (reputation === 'RISKY') repColor = '#fb923c';
    if (reputation === 'SPAMMY') repColor = '#f87171';

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
            backgroundColor: '#0a0e27', // Deep space blue
            backgroundImage: 'linear-gradient(to bottom, #0a0e27, #1a1b3a)',
            color: 'white',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Title */}
          <div style={{
            fontSize: '40px',
            fontWeight: 900,
            letterSpacing: '15px',
            color: '#00d9ff',
            marginBottom: '60px'
          }}>
            TRUESCORE
          </div>

          {/* 3 BOXES GRID */}
          <div style={{ display: 'flex', gap: '30px', width: '100%', justifyContent: 'center' }}>

            {/* Box 1: Neynar Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#161b33',
              borderRadius: '40px',
              border: '2px solid rgba(0, 217, 255, 0.3)',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.1)',
            }}>
              <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.6, marginTop: '20px', letterSpacing: '2px' }}>
                NEYNER SCORE
              </div>
            </div>

            {/* Box 2: Username */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#161b33',
              borderRadius: '40px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ fontSize: '45px', fontWeight: 900, textAlign: 'center', padding: '0 20px', wordBreak: 'break-all' }}>
                @{username}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.6, marginTop: '20px', letterSpacing: '2px' }}>
                USERNAME
              </div>
            </div>

            {/* Box 3: Reputation */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#161b33',
              borderRadius: '40px',
              border: `2px solid ${repColor}`,
              boxShadow: `0 0 30px ${repColor}20`,
            }}>
              <div style={{ fontSize: '60px', fontWeight: 900, color: repColor }}>{reputation}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.6, marginTop: '20px', letterSpacing: '2px' }}>
                REPUTATION
              </div>
            </div>

          </div>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.2)',
            fontWeight: 700
          }}>
            FID: {fid}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Error`, { status: 500 });
  }
}
