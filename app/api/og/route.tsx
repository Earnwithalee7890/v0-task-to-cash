import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Reliable color mapping
const getBoxColor = (rep: string) => {
  const r = (rep || '').toLowerCase();
  if (r.includes('safe')) return '#4ade80';
  if (r.includes('neutral')) return '#38bdf8';
  if (r.includes('risky')) return '#fb923c';
  if (r.includes('spammy')) return '#f87171';
  return '#94a3b8';
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extracting data passed from the share page
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'user';
    const reputation = searchParams.get('rep') || 'Unknown';
    const fid = searchParams.get('fid') || '0';

    const repColor = getBoxColor(reputation);

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
            padding: '40px',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            fontSize: '40px',
            fontWeight: 900,
            color: '#00d9ff',
            marginBottom: '40px',
            letterSpacing: '5px'
          }}>
            TRUESCORE
          </div>

          {/* 3 boxes layout */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

            {/* Box 1: Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '330px',
              height: '330px',
              backgroundColor: '#161b33',
              borderRadius: '24px',
              border: '2px solid rgba(0, 217, 255, 0.5)',
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '120px', fontWeight: 900, color: 'white' }}>{score}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.5, color: 'white', marginTop: '10px' }}>
                SCORE
              </div>
            </div>

            {/* Box 2: Username */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '330px',
              height: '330px',
              backgroundColor: '#161b33',
              borderRadius: '24px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '40px', fontWeight: 800, color: 'white', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
                @{username}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.5, color: 'white', marginTop: '10px' }}>
                USER
              </div>
            </div>

            {/* Box 3: Reputation */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '330px',
              height: '330px',
              backgroundColor: '#161b33',
              borderRadius: '24px',
              border: `2px solid ${repColor}`,
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '50px', fontWeight: 900, color: repColor }}>
                {reputation.toUpperCase()}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.5, color: 'white', marginTop: '10px' }}>
                STATUS
              </div>
            </div>

          </div>

          {/* Minimal footer */}
          <div style={{ position: 'absolute', bottom: '20px', opacity: 0.2, fontSize: '14px', color: 'white' }}>
            Powered by Neynar
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    // If anything fails, return a simple text-based error image instead of a broken icon
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', backgroundColor: '#0a0e27', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
          TrueScore Sharing Ready
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
