import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Log webhook events
    console.log("Farcaster webhook received:", body)

    // Return success
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET() {
  // Return success for health checks
  return NextResponse.json({ status: "ok" }, { status: 200 })
}
