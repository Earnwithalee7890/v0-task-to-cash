import { NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { NotificationTemplates, sendTemplateNotification } from '@/lib/notifications';

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

/**
 * Evening Neynar Engagement Notification
 * Runs daily at 9:00 PM UTC (2:30 AM IST next day)
 */
export async function GET() {
    try {
        console.log('[CRON] Evening Neynar engagement notification triggered');

        const tokens = notificationStorage.getAllTokens().map(t => t.token);

        if (tokens.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No users to notify',
                sentTo: 0
            });
        }

        const template = NotificationTemplates.neynarEngagementEvening(APP_URL);
        const result = await sendTemplateNotification(template, tokens);

        console.log(`[CRON] Evening engagement sent to ${tokens.length} users`);

        return NextResponse.json({
            success: result.success,
            message: result.message,
            sentTo: tokens.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[CRON] Error sending evening engagement:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
