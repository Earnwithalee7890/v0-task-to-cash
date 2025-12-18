import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
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
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  // ONLY show score, username, and reputation as requested
  // Using literal newlines ensures encodeURIComponent creates a single %0A
  const text = `${score}

@${username}
${reputation}`;

  // Use the robust Vercel legacy service for zero-failure rendering
  const ogImageUrl = `https://og-image.vercel.app/${encodeURIComponent(text)}.png?theme=dark&md=1&fontSize=100px`;

  return Response.redirect(ogImageUrl, 307);
}
