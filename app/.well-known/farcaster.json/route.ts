import { NextResponse } from "next/server"

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzODA2MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDI5NjYzN0YyMDMzRDQwQTVDNGE4ZjM1ODQ2YTkzNzEyYzViNzVFODkifQ",
      payload: "eyJkb21haW4iOiJ2MC10YXNrLXRvLWNhc2gtc2V2ZW4udmVyY2VsLmFwcCJ9",
      signature: "MHhlZGU2NjJjNTNmNGJmNGE2MTAzNGU3ZGE4NjI5NDQwZjJjMzc4ZmY3NTc1ZWI2MGQ4MzE3NGE1ZTMyMTBiNjY3NTk5ZjMyOWJhMjcyOTBkZTA5MTg3MzY0ZjgwYjlkODhlMmQ5YWM4NzI1M2QyODg4NDA2ZmRlNmU0MDY0MWJhMzFi"
    },
    frame: {
      version: "next",
      imageUrl: "https://v0-task-to-cash-seven.vercel.app/og-image.png",
      button: {
        title: "View My Score",
        action: {
          type: "launch_frame",
          name: "TrueScore",
          url: "https://v0-task-to-cash-seven.vercel.app",
          splashImageUrl: "https://v0-task-to-cash-seven.vercel.app/splash.png",
          splashBackgroundColor: "#1a1a2e"
        }
      }
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0",
    },
  })
}
