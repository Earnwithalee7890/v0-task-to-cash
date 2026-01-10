import { NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { sendTemplateNotification, NotificationTemplates } from '@/lib/notifications';

/**
 * Test endpoint to send sample notifications
 * GET /api/notifications/test?type=checkScore
 */

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'checkScore';

    // Get all tokens
    const allTokens = notificationStorage.getAllTokens();

    if (allTokens.length === 0) {
        return NextResponse.json({
            success: false,
            error: 'No users have enabled notifications yet',
            hint: 'Enable notifications in the mini app first',
        });
    }

    const tokens = allTokens.map(t => t.token);

    // Select template
    let template;
    switch (type) {
        case 'checkScore':
            template = NotificationTemplates.checkScore(APP_URL);
            break;
        case 'claimRewards':
            template = NotificationTemplates.claimRewards(APP_URL);
            break;
        default:
            template = NotificationTemplates.checkScore(APP_URL);
    }

    // Send test notification
    const result = await sendTemplateNotification(template, tokens);

    return NextResponse.json({
        ...result,
        template,
        sentTo: tokens.length,
        users: allTokens.map(t => ({ fid: t.fid })),
    });
}
