import { NextRequest, NextResponse } from 'next/server';
import { notificationStorage } from '@/lib/notification-storage';
import { sendNotification, NotificationTemplates } from '@/lib/notifications';

/**
 * Send notifications to users
 * POST /api/notifications/send
 */

const APP_URL = 'https://v0-task-to-cash-seven.vercel.app';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, fids, customMessage } = body;

        // Get tokens for specified FIDs
        const tokens = fids?.length > 0
            ? notificationStorage.getTokens(fids)
            : notificationStorage.getAllTokens().map(t => t.token);

        if (tokens.length === 0) {
            return NextResponse.json(
                { error: 'No notification tokens found' },
                { status: 404 }
            );
        }

        // Select notification template based on type
        let template;
        switch (type) {
            case 'checkScore':
                template = NotificationTemplates.checkScore(APP_URL);
                break;
            case 'claimRewards':
                template = NotificationTemplates.claimRewards(APP_URL);
                break;
            case 'scoreUpdated':
                template = NotificationTemplates.scoreUpdated(
                    body.newScore || 85,
                    APP_URL
                );
                break;
            case 'achievement':
                template = NotificationTemplates.achievementUnlocked(
                    body.achievement || 'New Achievement',
                    APP_URL
                );
                break;
            case 'reminder':
                template = NotificationTemplates.dailyReminder(
                    body.streak || 1,
                    APP_URL
                );
                break;
            case 'custom':
                template = {
                    title: customMessage?.title || 'TrueScore Update',
                    body: customMessage?.body || 'You have a new update!',
                    targetUrl: APP_URL,
                    notificationId: `custom-${Date.now()}`,
                };
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid notification type' },
                    { status: 400 }
                );
        }

        // Send notification
        const result = await sendNotification({
            ...template,
            tokens,
        });

        return NextResponse.json({
            success: result.success,
            message: result.message,
            error: result.error,
            sentTo: tokens.length,
        });
    } catch (error) {
        console.error('[API] Error sending notification:', error);
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
 * Get notification status
 * GET /api/notifications/send
 */
export async function GET() {
    const allTokens = notificationStorage.getAllTokens();

    return NextResponse.json({
        totalUsers: allTokens.length,
        users: allTokens.map(t => ({
            fid: t.fid,
            enabledAt: new Date(t.enabledAt).toISOString(),
        })),
        availableTypes: [
            'checkScore',
            'claimRewards',
            'scoreUpdated',
            'achievement',
            'reminder',
            'custom',
        ],
    });
}
