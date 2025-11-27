import { NextResponse } from "next/server"

export async function GET() {
  const appUrl = "https://v0-task-to-cash-seven.vercel.app"

  const manifest = {
    accountAssociation: {
      header:
        "eyJmaWQiOjMzODA2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweEJDNzRlQTExNWY0ZjMwQ2U3MzdGMzk0YTkzNzAxQWJkMTY0MmQ3RDEifQ",
      payload: "eyJkb21haW4iOiJ2MC10YXNrLXRvLWNhc2gtc2V2ZW4udmVyY2VsLmFwcCJ9",
      signature: "XtjTSm1mIbMtK34XLcJ/G4AnGzPrfgnH4aS/lVZHxAsxJwzF10BG8XnCTppCqz96NN289eEAwx+sXmiFxPgndhw=",
    },
    frame: {
      version: "1",
      name: "TrueScore",
      subtitle: "Your Real Neynar Reputation",
      description:
        "View your real Neynar score, engagement analytics, and account reputation on Farcaster. Includes daily check-in and tip features.",
      iconUrl: `${appUrl}/icon.jpg`,
      splashImageUrl: `${appUrl}/splash.jpg`,
      splashBackgroundColor: "#1a1a2e",
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "social",
      tags: ["reputation", "analytics", "neynar", "score"],
    },
  }

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
