import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Remove Edge runtime to use stable Node.js runtime instead
// export const runtime = 'edge'; 

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Using shortened params for max reliability
    const s = searchParams.get('s') || '0';
    const u = searchParams.get('u') || 'user';
    const r = searchParams.get('r') || 'Unknown';
    const f = searchParams.get('fid') || '0';

    // Color logic
    let color = '#94a3b8'; // Default Gray
    const status = r.toLowerCase();
    if (status.includes('safe')) color = '#22c55e';    // Green
    if (status.includes('neutral')) color = '#0ea5e9'; // Blue
    if (status.includes('risky')) color = '#f97316';   // Orange
    if (status.includes('spammy')) color = '#ef4444'; // Red

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
            color: 'white',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Title */}
          <div style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#00d9ff',
            marginBottom: '40px',
            letterSpacing: '10px'
          }}>
            TRUESCORE
          </div>

          {/* Row of 3 boxes */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>

            {/* Box 1: Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#111827',
              borderRadius: '20px',
              border: '2px solid rgba(0, 217, 255, 0.4)',
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '100px', fontWeight: 'bold' }}>{s}</div>
              <div style={{ fontSize: '18px', opacity: 0.5, marginTop: '10px' }}>NEYNER SCORE</div>
            </div>

            {/* Box 2: User */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#111827',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', padding: '0 10px' }}>@{u}</div>
              <div style={{ fontSize: '18px', opacity: 0.5, marginTop: '10px' }}>USERNAME</div>
            </div>

            {/* Box 3: Reputation */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '350px',
              backgroundColor: '#111827',
              borderRadius: '20px',
              border: `2px solid ${color}`,
              margin: '0 10px',
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: color }}>{r.toUpperCase()}</div>
              <div style={{ fontSize: '18px', opacity: 0.5, marginTop: '10px' }}>REPUTATION</div>
            </div>

          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: '20px', opacity: 0.3, fontSize: '16px' }}>
            FID: {f} • Powered by Neynar
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response('Error rendering', { status: 200 });
  }
}
