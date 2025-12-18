import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Simple helper to pick colors for reputations
const getRepColor = (rep: string) => {
  const r = rep.toLowerCase();
  if (r.includes('safe')) return '#4ade80';   // Green
  if (r.includes('neutral')) return '#38bdf8'; // Blue
  if (r.includes('risky')) return '#fb923c';   // Orange
  if (r.includes('spammy')) return '#f87171'; // Red
  return '#94a3b8';                           // Gray
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get parameters directly from URL (Zero-Fetch Strategy)
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'user';
    const reputation = searchParams.get('rep') || 'Unknown';
    const fid = searchParams.get('fid') || '0';

    const repColor = getRepColor(reputation);

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
            backgroundColor: '#0a0e27',
            backgroundImage: 'linear-gradient(to bottom, #0a0e27, #1e293b)',
            color: 'white',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '8px',
            color: '#00d9ff',
            marginBottom: '40px'
          }}>
            TRUESCORE
          </div>

          {/* Grid of 3 boxes - Using margins instead of gap for max compatibility */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

            {/* Box 1: Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '320px',
              backgroundColor: '#161b33',
              borderRadius: '24px',
              border: '2px solid rgba(0, 217, 255, 0.4)',
              margin: '0 12px',
            }}>
              <div style={{ fontSize: '110px', fontWeight: 900, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, opacity: 0.5, marginTop: '16px', letterSpacing: '2px' }}>
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
              borderRadius: '24px',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              margin: '0 12px',
            }}>
              <div style={{
                fontSize: '40px',
                fontWeight: 800,
                width: '100%',
                textAlign: 'center',
                padding: '0 15px',
                overflow: 'hidden'
              }}>
                @{username}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, opacity: 0.5, marginTop: '16px', letterSpacing: '2px' }}>
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
              borderRadius: '24px',
              border: `2px solid ${repColor}`,
              margin: '0 12px',
            }}>
              <div style={{ fontSize: '44px', fontWeight: 900, color: repColor, textAlign: 'center', width: '100%' }}>
                {reputation.toUpperCase()}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, opacity: 0.5, marginTop: '16px', letterSpacing: '2px' }}>
                REPUTATION
              </div>
            </div>

          </div>

          {/* Footer */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            fontSize: '16px',
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
    return new Response(`Error`, { status: 200 }); // Graceful fail
  }
}
