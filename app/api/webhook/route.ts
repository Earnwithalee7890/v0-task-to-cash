import { type NextRequest, NextResponse } from "next/server"

// Webhook handler for Farcaster Frame events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different webhook events
    // Events include: frame_added, frame_removed, notifications_enabled, notifications_disabled
    console.log("Farcaster webhook received:", body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
