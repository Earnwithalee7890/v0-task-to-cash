import { NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { NotificationTemplates, sendTemplateNotification } from '@/lib/notifications';

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

/**
 * Afternoon Neynar Engagement Notification
 * Runs daily at 3:00 PM UTC (8:30 PM IST)
 */
export async function GET() {
    try {
        console.log('[CRON] Afternoon Neynar engagement notification triggered');

        const tokens = notificationStorage.getAllTokens().map(t => t.token);

        if (tokens.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No users to notify',
                sentTo: 0
            });
        }

        const template = NotificationTemplates.neynarEngagementAfternoon(APP_URL);
        const result = await sendTemplateNotification(template, tokens);

        console.log(`[CRON] Afternoon engagement sent to ${tokens.length} users`);

        return NextResponse.json({
            success: result.success,
            message: result.message,
            sentTo: tokens.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[CRON] Error sending afternoon engagement:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
