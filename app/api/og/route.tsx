import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get parameters from URL (passed from share page)
    // We prioritize these for instant, stable rendering
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'user';
    const reputation = (searchParams.get('rep') || 'unknown').toUpperCase();
    const builder = searchParams.get('builder') || '0';
    const creator = searchParams.get('creator') || '0';
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
            backgroundImage: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '100%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '5px',
              color: '#22d3ee',
              textShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
            }}>
              TRUESCORE
            </div>
          </div>

          {/* Main Score Circle */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 0 50px rgba(79, 70, 229, 0.4)',
            border: '4px solid rgba(167, 139, 250, 0.3)',
            marginBottom: '30px',
          }}>
            <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, opacity: 0.8, marginTop: '5px', letterSpacing: '2px' }}>NEYNAR SCORE</div>
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '42px', fontWeight: 800, marginBottom: '10px' }}>@{username}</div>
            <div style={{
              fontSize: '20px',
              fontWeight: 900,
              padding: '8px 25px',
              borderRadius: '50px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: `2px solid ${repColor}`,
              color: repColor,
              letterSpacing: '3px'
            }}>
              {reputation}
            </div>
          </div>

          {/* Talent Protocol Stats (Footer corner) */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa', opacity: 0.6 }}>BUILDER</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>{builder}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f472b6', opacity: 0.6 }}>CREATOR</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>{creator}</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.3)',
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
