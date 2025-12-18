import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get parameters directly from URL (Zero-Fetch Strategy)
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'user';
    const reputation = (searchParams.get('rep') || 'unknown').toUpperCase();
    const fid = searchParams.get('fid') || '0';

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
            color: 'white',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Title */}
          <div style={{
            display: 'flex',
            fontSize: '36px',
            fontWeight: 900,
            letterSpacing: '12px',
            color: '#00d9ff',
            marginBottom: '50px',
            textTransform: 'uppercase'
          }}>
            TRUESCORE
          </div>

          {/* 3 BOXES GRID */}
          <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

            {/* Box 1: Neynar Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '320px',
              backgroundColor: '#161b33',
              borderRadius: '32px',
              border: '4px solid #00d9ff33',
            }}>
              <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, opacity: 0.5, marginTop: '20px', letterSpacing: '2px' }}>
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
              height: '320px',
              backgroundColor: '#161b33',
              borderRadius: '32px',
              border: '4px solid #ffffff1a',
            }}>
              <div style={{
                fontSize: '44px',
                fontWeight: 800,
                width: '100%',
                textAlign: 'center',
                padding: '0 20px',
                overflow: 'hidden'
              }}>
                @{username}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, opacity: 0.5, marginTop: '20px', letterSpacing: '2px' }}>
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
              height: '320px',
              backgroundColor: '#161b33',
              borderRadius: '32px',
              border: `4px solid ${repColor}`,
            }}>
              <div style={{ fontSize: '50px', fontWeight: 900, color: repColor }}>{reputation}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, opacity: 0.5, marginTop: '20px', letterSpacing: '2px' }}>
                REPUTATION
              </div>
            </div>

          </div>

          {/* Footer FID */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.1)',
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
    return new Response(`Error rendering image`, { status: 500 });
  }
}
