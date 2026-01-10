/**
 * Farcaster Mini App Notification Service
 */

const FARCASTER_NOTIFICATIONS_API = 'https://api.farcaster.xyz/v1/miniapps/notifications';

export interface SendNotificationParams {
    notificationId: string;
    title: string;
    body: string;
    targetUrl: string;
    tokens: string[];
}

export interface NotificationResponse {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * Send notification to Farcaster users
 */
export async function sendNotification(
    params: SendNotificationParams
): Promise<NotificationResponse> {
    try {
        const response = await fetch(FARCASTER_NOTIFICATIONS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notificationId: params.notificationId,
                title: params.title.slice(0, 32), // Max 32 chars
                body: params.body.slice(0, 128), // Max 128 chars
                targetUrl: params.targetUrl,
                tokens: params.tokens.slice(0, 100), // Max 100 tokens
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[Notifications] Send failed:', error);
            return {
                success: false,
                error: `HTTP ${response.status}: ${error}`,
            };
        }

        const result = await response.json();
        console.log('[Notifications] Sent successfully:', params.notificationId);

        return {
            success: true,
            message: result.message || 'Notification sent',
        };
    } catch (error) {
        console.error('[Notifications] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Notification Templates
 */

export const NotificationTemplates = {
    /**
     * Check your Neynar score notification
     */
    checkScore: (appUrl: string) => ({
        title: 'Check Your Neynar Score! 🎯',
        body: 'Open and see your latest reputation score',
        targetUrl: `${appUrl}`,
        notificationId: `score-check-${Date.now()}`,
    }),

    /**
     * Claim rewards notification
     */
    claimRewards: (appUrl: string) => ({
        title: 'Claim Your Rewards! 🎁',
        body: 'Check in now and claim your daily rewards',
        targetUrl: `${appUrl}`,
        notificationId: `claim-rewards-${Date.now()}`,
    }),

    /**
     * Score updated notification
     */
    scoreUpdated: (newScore: number, appUrl: string) => ({
        title: 'Score Updated! 🎯',
        body: `Your Neynar score is now ${newScore}!`,
        targetUrl: `${appUrl}`,
        notificationId: `score-update-${Date.now()}`,
    }),

    /**
     * Achievement unlocked notification
     */
    achievementUnlocked: (achievement: string, appUrl: string) => ({
        title: 'Achievement Unlocked! 🏆',
        body: `You earned: ${achievement}`,
        targetUrl: `${appUrl}`,
        notificationId: `achievement-${Date.now()}`,
    }),

    /**
     * Daily reminder notification
     */
    dailyReminder: (streak: number, appUrl: string) => ({
        title: "Don't Break Your Streak! 🔥",
        body: `Keep your ${streak}-day streak going!`,
        targetUrl: `${appUrl}`,
        notificationId: `reminder-${Date.now()}`,
    }),
};

/**
 * Send notification using a template
 */
export async function sendTemplateNotification(
    template: ReturnType<typeof NotificationTemplates[keyof typeof NotificationTemplates]>,
    tokens: string[]
): Promise<NotificationResponse> {
    return sendNotification({
        ...template,
        tokens,
    });
}
