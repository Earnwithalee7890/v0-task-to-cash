import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get parameters from URL (passed from share page)
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'user';
    const reputation = (searchParams.get('rep') || 'unknown').toUpperCase();
    const fid = searchParams.get('fid') || '0';

    // Color mapping for reputation
    let repColor = '#94a3b8'; // gray
    if (reputation === 'SAFE') repColor = '#4ade80'; // green
    if (reputation === 'NEUTRAL') repColor = '#38bdf8'; // blue
    if (reputation === 'RISKY') repColor = '#fb923c'; // orange
    if (reputation === 'SPAMMY') repColor = '#f87171'; // red

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
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
            color: 'white',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '8px',
              color: '#22d3ee',
            }}>
              TRUESCORE
            </div>
          </div>

          {/* Main Score Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '320px',
            height: '320px',
            borderRadius: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '40px',
          }}>
            <div style={{ fontSize: '140px', fontWeight: 900, lineHeight: 1, color: '#f8fafc' }}>
              {score}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, opacity: 0.5, marginTop: '10px', letterSpacing: '3px' }}>
              NEYNER SCORE
            </div>
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '56px', fontWeight: 800, marginBottom: '20px' }}>
              @{username}
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 900,
              padding: '12px 40px',
              borderRadius: '100px',
              backgroundColor: `${repColor}20`,
              border: `3px solid ${repColor}`,
              color: repColor,
              letterSpacing: '4px'
            }}>
              {reputation}
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
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
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
