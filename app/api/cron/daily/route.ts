import { NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { NotificationTemplates, sendTemplateNotification } from '@/lib/notifications';

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

/**
 * Daily Notifications - Consolidated
 * Runs daily at 9:00 AM UTC (2:30 PM IST)
 * Sends: Check-in reminder + Rotating Neynar engagement tips
 */
export async function GET() {
    try {
        console.log('[CRON] Daily notifications triggered');

        const tokens = notificationStorage.getAllTokens().map(t => t.token);

        if (tokens.length === 0) {
            console.log('[CRON] No notification tokens found');
            return NextResponse.json({
                success: true,
                message: 'No users to notify',
                sentTo: 0
            });
        }

        // Send check-in reminder
        const checkInTemplate = NotificationTemplates.dailyCheckIn(APP_URL);
        const checkInResult = await sendTemplateNotification(checkInTemplate, tokens);

        // Rotate Neynar engagement tips based on day of week
        const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        let neynarTemplate;

        switch (dayOfWeek % 3) {
            case 0:
                neynarTemplate = NotificationTemplates.neynarEngagementMorning(APP_URL);
                break;
            case 1:
                neynarTemplate = NotificationTemplates.neynarEngagementAfternoon(APP_URL);
                break;
            case 2:
                neynarTemplate = NotificationTemplates.neynarEngagementEvening(APP_URL);
                break;
            default:
                neynarTemplate = NotificationTemplates.neynarEngagementMorning(APP_URL);
        }

        const neynarResult = await sendTemplateNotification(neynarTemplate, tokens);

        console.log(`[CRON] Daily notifications sent to ${tokens.length} users`);

        return NextResponse.json({
            success: true,
            message: 'Daily notifications sent',
            checkIn: checkInResult.success,
            neynar: neynarResult.success,
            sentTo: tokens.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[CRON] Error sending daily notifications:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
