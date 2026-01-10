import { NextRequest, NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';

/**
 * Webhook endpoint to receive Farcaster notification events
 * POST /api/webhook/notifications
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('[Webhook] Received event:', body.event);

        // Handle different webhook events
        switch (body.event) {
            case 'notifications_enabled':
                // User enabled notifications
                const { notificationDetails } = body;
                const fid = body.fid || body.untrustedData?.fid;

                if (!fid || !notificationDetails?.token) {
                    console.error('[Webhook] Missing FID or token');
                    return NextResponse.json(
                        { error: 'Missing FID or token' },
                        { status: 400 }
                    );
                }

                // Store the notification token
                notificationStorage.storeToken(
                    fid.toString(),
                    notificationDetails.token,
                    notificationDetails.url || ''
                );

                console.log(`[Webhook] Notifications enabled for FID ${fid}`);

                return NextResponse.json({
                    success: true,
                    message: 'Notification token stored',
                    fid,
                });

            case 'notifications_disabled':
                // User disabled notifications
                const disabledFid = body.fid || body.untrustedData?.fid;

                if (disabledFid) {
                    notificationStorage.removeToken(disabledFid.toString());
                    console.log(`[Webhook] Notifications disabled for FID ${disabledFid}`);
                }

                return NextResponse.json({
                    success: true,
                    message: 'Notification token removed',
                });

            default:
                console.log('[Webhook] Unknown event type:', body.event);
                return NextResponse.json({
                    success: true,
                    message: 'Event received',
                });
        }
    } catch (error) {
        console.error('[Webhook] Error processing event:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Health check endpoint
 */
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        endpoint: 'notifications webhook',
        tokensStored: notificationStorage.getCount(),
    });
}
