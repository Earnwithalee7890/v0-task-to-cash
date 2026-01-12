import { NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { NotificationTemplates, sendTemplateNotification } from '@/lib/notifications';

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

/**
 * Daily Check-In Notification
 * Runs daily at 9:00 AM UTC (2:30 PM IST)
 */
export async function GET() {
    try {
        // Verify this is a cron request
        const authHeader = process.env.CRON_SECRET;

        console.log('[CRON] Daily check-in notification triggered');

        // Get all notification tokens
        const tokens = notificationStorage.getAllTokens().map(t => t.token);

        if (tokens.length === 0) {
            console.log('[CRON] No notification tokens found');
            return NextResponse.json({
                success: true,
                message: 'No users to notify',
                sentTo: 0
            });
        }

        // Send notification
        const template = NotificationTemplates.dailyCheckIn(APP_URL);
        const result = await sendTemplateNotification(template, tokens);

        console.log(`[CRON] Daily check-in sent to ${tokens.length} users`);

        return NextResponse.json({
            success: result.success,
            message: result.message,
            sentTo: tokens.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[CRON] Error sending daily check-in:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
